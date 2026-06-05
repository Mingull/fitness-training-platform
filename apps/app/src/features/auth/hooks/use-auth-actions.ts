import { apiClient } from "@/lib/api-client";
import { decryptJWT } from "@/lib/jwt";
import { ClientResult } from "@fitness/api-client/types";
import { signinContract } from "@fitness/contracts/auth";
import { useCallback } from "react";
import { z } from "zod";
import { useSession } from "../context";

type AuthActions = {
	signIn: (data: z.infer<typeof signinContract>) => Promise<ClientResult<{ success: boolean }>>;
	signOut: () => void;
	/**
	 * Manually trigger a refresh of the access token using the current refresh token. This is useful for retrying API calls after a token has expired.
	 * @returns The result of the token refresh attempt, which will indicate success or provide an error if the refresh fails (e.g. due to an invalid or expired refresh token).
	 */
	refresh: () => Promise<ClientResult<{ success: boolean }>>;
	/**
	 * A "middleware" function that will attempt to refresh the access token and retry the provided function once if it receives an auth error.
	 * @see {@link AuthContext.refresh} for manually triggering a token refresh.
	 * @param fn The function to execute with the current access token, and again with a refreshed token if needed.
	 * @returns The result of the provided function, or an auth error if the token refresh fails.
	 */
	withRefresh: <R>(fn: (accessToken?: string) => Promise<ClientResult<R>> | ClientResult<R>) => Promise<ClientResult<R>>;
};

export const useAuthActions = (): AuthActions => {
	const { accessTokenRef, refreshTokenRef, updateAccessToken, updateRefreshToken, setUserId, setUserRole } = useSession();
	const clearSession = useCallback(() => {
		updateAccessToken(null);
		updateRefreshToken(null);
		setUserId(null);
		setUserRole(null);
	}, [updateAccessToken, updateRefreshToken, setUserId, setUserRole]);

	const hydrateSessionFromAccessToken = useCallback(
		async (accessToken: string): Promise<ClientResult<{ success: boolean }>> => {
			try {
				const payload = await decryptJWT<{ email: string; role: string; sub: string }>(accessToken);
				setUserId(payload.sub);
				setUserRole(payload.role);
				return {
					data: { success: true },
					error: null,
				};
			} catch (error) {
				clearSession();
				return {
					data: null,
					error: {
						code: "unknown",
						message: "Failed to decode access token.",
						details: error,
					},
				};
			}
		},
		[clearSession, setUserId, setUserRole],
	);
	// Memoize the auth actions so consumers don't receive new callback references on every render.
	const signIn = useCallback(
		async (data: z.infer<typeof signinContract>): Promise<ClientResult<{ success: boolean }>> => {
			const result = await apiClient.auth.signIn(data);

			if (result.error) {
				return {
					data: null,
					error: {
						code: result.error.code,
						message: result.error.message || "Failed to sign in.",
						statusCode: result.error.statusCode,
						details: result.error.details,
					},
				};
			}

			const tokens = result.data.data;
			updateAccessToken(tokens.accessToken);
			updateRefreshToken(tokens.refreshToken);
			return await hydrateSessionFromAccessToken(tokens.accessToken);
		},
		[hydrateSessionFromAccessToken, updateAccessToken, updateRefreshToken],
	);
	const signOut = useCallback(() => {
		clearSession();
	}, [clearSession]);
	const refresh = useCallback(async (): Promise<ClientResult<{ success: boolean }>> => {
		const currentRefreshToken = refreshTokenRef.current;

		if (!currentRefreshToken) {
			clearSession();
			return {
				data: null,
				error: {
					code: "missing_token",
					message: "No refresh token available.",
				},
			};
		}

		const result = await apiClient.auth.refresh({ refreshToken: currentRefreshToken });
		if (result.error) {
			if (result.error.code === "http" && (result.error.statusCode === 400 || result.error.statusCode === 401 || result.error.statusCode === 403)) {
				clearSession();
			}
			return {
				data: null,
				error: result.error,
			};
		}

		const tokens = result.data.data;
		updateAccessToken(tokens.accessToken);
		updateRefreshToken(tokens.refreshToken);

		return await hydrateSessionFromAccessToken(tokens.accessToken);
	}, [clearSession, hydrateSessionFromAccessToken, refreshTokenRef, updateAccessToken, updateRefreshToken]);

	const withRefresh = useCallback(
		async <R>(fn: (token?: string) => Promise<ClientResult<R>> | ClientResult<R>): Promise<ClientResult<R>> => {
			const result = await fn(accessTokenRef.current ?? undefined);

			if (result.error && (result.error.code === "missing_token" || (result.error.code === "http" && result.error.statusCode === 401))) {
				// If the error indicates an auth issue, attempt to refresh the token and retry the original function once.
				const refreshResult = await refresh();
				if (refreshResult.error) {
					return refreshResult as ClientResult<R>;
				}
				return await fn(accessTokenRef.current ?? undefined);
			}
			return result;
		},
		[refresh, accessTokenRef],
	);

	return { signIn, signOut, refresh, withRefresh };
};

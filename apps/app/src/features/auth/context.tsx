import { useStorageState } from "@/hooks/use-storage-state";
import { apiClient } from "@/lib/api-client";
import { ClientResult } from "@fitness/api-client/types";
import { signinContract } from "@fitness/contracts/auth";
import { createContext, use, useCallback, useEffect, useMemo, useRef, type PropsWithChildren } from "react";
import { z } from "zod";

type AuthContext = {
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
	withRefresh: <R>(fn: (accessToken?: string | null) => Promise<ClientResult<R>> | ClientResult<R>) => Promise<ClientResult<R>>;
	session?: string | null;
	isLoading: boolean;
};

const AuthContext = createContext<AuthContext | null>(null);

// Use this hook to access the user info.
export function useSession() {
	const value = use(AuthContext);
	if (!value) {
		throw new Error("useSession must be wrapped in a <SessionProvider />");
	}

	return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
	const [[isLoadingAccessToken, accessToken], setAccessToken] = useStorageState("session.accessToken");
	const [[isLoadingRefreshToken, refreshToken], setRefreshToken] = useStorageState("session.refreshToken");
	const accessTokenRef = useRef(accessToken);
	const refreshTokenRef = useRef(refreshToken);
	useEffect(() => {
		accessTokenRef.current = accessToken;
		refreshTokenRef.current = refreshToken;
	}, [refreshToken, accessToken]);
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
			setAccessToken(tokens.accessToken);
			accessTokenRef.current = tokens.accessToken;
			setRefreshToken(tokens.refreshToken);
			refreshTokenRef.current = tokens.refreshToken;
			return {
				data: { success: true },
				error: null,
			};
		},
		[setAccessToken, setRefreshToken],
	);
	const signOut = useCallback(() => {
		setAccessToken(null);
		accessTokenRef.current = null;
		setRefreshToken(null);
		refreshTokenRef.current = null;
	}, [setAccessToken, setRefreshToken]);
	const refresh = useCallback(async (): Promise<ClientResult<{ success: boolean }>> => {
		const currentRefreshToken = refreshTokenRef.current;

		if (!currentRefreshToken) {
			setAccessToken(null);
			accessTokenRef.current = null;
			setRefreshToken(null);
			refreshTokenRef.current = null;
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
				setAccessToken(null);
				accessTokenRef.current = null;
				setRefreshToken(null);
				refreshTokenRef.current = null;
			}
			return {
				data: null,
				error: result.error,
			};
		}

		const tokens = result.data.data;
		setAccessToken(tokens.accessToken);
		accessTokenRef.current = tokens.accessToken;
		setRefreshToken(tokens.refreshToken);
		refreshTokenRef.current = tokens.refreshToken;

		return {
			data: { success: true },
			error: null,
		};
	}, [setAccessToken, setRefreshToken]);

	const withRefresh = useCallback(
		async <R,>(fn: (token?: string | null) => Promise<ClientResult<R>> | ClientResult<R>): Promise<ClientResult<R>> => {
			const result = await fn(accessTokenRef.current);

			if (result.error && (result.error.code === "missing_token" || (result.error.code === "http" && result.error.statusCode === 401))) {
				// If the error indicates an auth issue, attempt to refresh the token and retry the original function once.
				const refreshResult = await refresh();
				if (refreshResult.error) {
					return refreshResult as ClientResult<R>;
				}
				return await fn(accessTokenRef.current);
			}
			return result;
		},
		[refresh],
	);
	// Memoize the provider value so consumers only re-render when exposed auth state actually changes.
	const value = useMemo<AuthContext>(
		() => ({
			signIn,
			signOut,
			refresh,
			withRefresh,
			session: accessToken,
			isLoading: isLoadingAccessToken || isLoadingRefreshToken,
		}),
		[accessToken, isLoadingAccessToken, isLoadingRefreshToken, refresh, signIn, signOut, withRefresh],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

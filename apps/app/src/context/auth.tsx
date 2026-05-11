import { useStorageState } from "@/hooks/use-storage-state";
import { apiClient } from "@/lib/api-client";
import { ClientResult } from "@fitness/api-client/types";
import { signinContract } from "@fitness/contracts/auth";
import { createContext, use, useCallback, useEffect, useMemo, useRef, type PropsWithChildren } from "react";
import { z } from "zod";

type AuthResult = ClientResult<{ success: boolean }>;

type AuthContextValue = {
	signIn: (data: z.infer<typeof signinContract>) => Promise<ClientResult<{ success: boolean }>>;
	signOut: () => void;
	refresh: () => Promise<ClientResult<{ success: boolean }>>;
	session?: string | null;
	isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

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
	// Keep the latest refresh token in a ref so `refresh` can stay memoized when tokens rotate.
	const refreshTokenRef = useRef(refreshToken);
	useEffect(() => {
		refreshTokenRef.current = refreshToken;
	}, [refreshToken]);
	// Memoize the auth actions so consumers don't receive new callback references on every render.
	const signIn = useCallback(
		async (data: z.infer<typeof signinContract>): Promise<AuthResult> => {
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
		setRefreshToken(null);
		refreshTokenRef.current = null;
	}, [setAccessToken, setRefreshToken]);
	const refresh = useCallback(async (): Promise<AuthResult> => {
		const currentRefreshToken = refreshTokenRef.current;

		if (!currentRefreshToken) {
			setAccessToken(null);
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
			return {
				data: null,
				error: result.error,
			};
		}

		const tokens = result.data.data;
		setAccessToken(tokens.accessToken);
		setRefreshToken(tokens.refreshToken);
		refreshTokenRef.current = tokens.refreshToken;
		return {
			data: { success: true },
			error: null,
		};
	}, [setAccessToken, setRefreshToken]);
	// Memoize the provider value so consumers only re-render when exposed auth state actually changes.
	const value = useMemo<AuthContextValue>(
		() => ({
			signIn,
			signOut,
			refresh,
			session: accessToken,
			isLoading: isLoadingAccessToken || isLoadingRefreshToken,
		}),
		[accessToken, isLoadingAccessToken, isLoadingRefreshToken, refresh, signIn, signOut],
	);

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
}

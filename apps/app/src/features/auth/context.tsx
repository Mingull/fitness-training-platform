import { useStorageState } from "@/hooks/use-storage-state";
import { createContext, use, useCallback, useEffect, useMemo, useRef, type PropsWithChildren } from "react";

type SessionContext = {
	/**
	 * The current access token for the session.
	 * This is reactive state and should be used for rendering and auth-related UI decisions.
	 * It may be null while storage is loading or when the session has been cleared.
	 */
	accessToken: string | null;
	/**
	 * The current access token as a ref.
	 * This is intended for imperative and async code that needs the latest token without re-rendering.
	 * Do not use it as the source of truth for UI state.
	 */
	accessTokenRef: React.RefObject<string | null>;
	/**
	 * Updates the current access token state and keeps the ref in sync.
	 * Use this instead of calling the storage setter directly when the latest token must be available immediately to async code.
	 * @param token The new access token value, or null to clear the token on sign out.
	 */
	updateAccessToken: (token: string | null) => void;
	/**
	 * The current refresh token for the session.
	 * This is reactive state and should be used for rendering and auth-related UI decisions.
	 * It may be null while storage is loading or when the session has been cleared.
	 */
	refreshToken: string | null;
	/**
	 * The current refresh token as a ref.
	 * This is intended for imperative and async code that needs the latest token without re-rendering.
	 * Do not use it as the source of truth for UI state.
	 */
	refreshTokenRef: React.RefObject<string | null>;
	/**
	 * Updates the current refresh token state and keeps the ref in sync.
	 * Use this instead of calling the storage setter directly when the latest token must be available immediately to async code.
	 * @param token The new refresh token value, or null to clear the token on sign out.
	 */
	updateRefreshToken: (token: string | null) => void;
	/**
	 * The current session's user ID provided by the auth API responses.
	 * This is reactive state and should be used for rendering and route protection.
	 * It is stored alongside the session tokens so consumers do not need to decode JWTs client-side.
	 */
	userId: string | null;
	/**
	 * Setter for the current user ID stored alongside the session tokens.
	 * @param id The new user ID value, or null to clear it on sign out.
	 */
	setUserId: (id: string | null) => void;
	/**
	 * The current session's user role, which can be used for role-based access control in the app.
	 * Like the user ID, this is stored alongside the tokens for easy access without decoding JWTs.
	 * This value comes from the session payload or a decoded JWT claim and may be cleared when the session is cleared.
	 */
	userRole: string | null;
	/**
	 * Setter for the current user role.
	 * Use this when the role is known from a successful sign-in, refresh, or decoded session payload.
	 * @param role The new user role value, or null to clear it on sign out.
	 */
	setUserRole: (role: string | null) => void;
	/**
	 * Indicates whether the auth state is still loading, such as when the stored session is being restored.
	 * Consumers should wait for this to become false before making route or auth decisions.
	 */
	isLoading: boolean;
	/**
	 * Indicates whether the app currently has a usable session loaded.
	 * This is a convenience flag for route guards and UI and is derived from the loaded session state.
	 * It is false while loading and becomes true when at least one session token is present.
	 */
	isAuthenticated: boolean;
};

const sessionContext = createContext<SessionContext | null>(null);

/**
 * Returns the current session context.
 * Use this hook inside components that need access to auth state, tokens, or auth actions.
 * It throws if the component is rendered outside of a `SessionProvider`.
 */
export function useSession() {
	const value = use(sessionContext);
	if (!value) {
		throw new Error("useSession must be wrapped in a <SessionProvider />");
	}

	return value;
}

/**
 * Provides session state and auth helpers to the app.
 * This provider restores persisted session data, keeps the reactive state and refs in sync,
 * and exposes a derived `isAuthenticated` flag for route guards and UI.
 */
export function SessionProvider({ children }: PropsWithChildren) {
	const [[isLoadingAccessToken, accessToken], setAccessToken] = useStorageState("session.accessToken");
	const [[isLoadingRefreshToken, refreshToken], setRefreshToken] = useStorageState("session.refreshToken");
	const [[isLoadingUserId, userId], setUserId] = useStorageState("session.userId");
	const [[isLoadingUserRole, userRole], setUserRole] = useStorageState("session.userRole");
	const isLoading = isLoadingAccessToken || isLoadingRefreshToken || isLoadingUserId || isLoadingUserRole;

	const accessTokenRef = useRef(accessToken);
	const refreshTokenRef = useRef(refreshToken);

	useEffect(() => {
		accessTokenRef.current = accessToken;
		refreshTokenRef.current = refreshToken;
	}, [accessToken, refreshToken]);

	const updateAccessToken = useCallback(
		(token: string | null) => {
			setAccessToken(token);
			accessTokenRef.current = token;
		},
		[setAccessToken],
	);

	const updateRefreshToken = useCallback(
		(token: string | null) => {
			setRefreshToken(token);
			refreshTokenRef.current = token;
		},
		[setRefreshToken],
	);

	// Memoize the provider value so consumers only re-render when exposed auth state actually changes.
	const value = useMemo<SessionContext>(
		() => ({
			accessToken,
			accessTokenRef,
			updateAccessToken,
			refreshToken,
			refreshTokenRef,
			updateRefreshToken,
			userId,
			setUserId,
			userRole,
			setUserRole,
			isLoading,
			isAuthenticated: !isLoading && (!!accessToken || !!refreshToken),
		}),
		[
			accessToken,
			accessTokenRef,
			updateAccessToken,
			refreshToken,
			refreshTokenRef,
			updateRefreshToken,
			userId,
			setUserId,
			userRole,
			setUserRole,
			isLoading,
		],
	);

	return <sessionContext.Provider value={value}>{children}</sessionContext.Provider>;
}

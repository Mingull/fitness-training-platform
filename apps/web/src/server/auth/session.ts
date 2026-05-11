export type AuthTokens = {
	accessToken: string;
	refreshToken: string;
};

export const accessTokenCookieName = "access_token";
export const refreshTokenCookieName = "refresh_token";

const isProduction = process.env.NODE_ENV === "production";

export const authCookieOptions = {
	httpOnly: true,
	secure: isProduction,
	sameSite: "lax" as const,
	path: "/",
};

export type Cookies = {
	get: (name: string) => { name: string; value: string } | undefined;
	set: (
		name: string,
		value: string,
		options?: {
			httpOnly?: boolean;
			secure?: boolean;
			sameSite?: "lax" | "strict" | "none";
			path?: string;
			maxAge?: number;
			expires?: number;
		},
	) => void;
	delete: (name: string) => void;
};

export const getAccessToken = (cookieStore: Pick<Cookies, "get">): string | undefined => {
	return cookieStore.get(accessTokenCookieName)?.value;
};

export const getRefreshToken = (cookieStore: Pick<Cookies, "get">): string | undefined => {
	return cookieStore.get(refreshTokenCookieName)?.value;
};

export const setAuthCookies = (cookieStore: Pick<Cookies, "set">, tokens: AuthTokens, opts?: { remember?: boolean }) => {
	cookieStore.set(accessTokenCookieName, tokens.accessToken, {
		...authCookieOptions,
		maxAge: 60 * 15,
	});

	cookieStore.set(refreshTokenCookieName, tokens.refreshToken, {
		...authCookieOptions,
		maxAge: opts?.remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
	});
};

export const clearAuthCookies = (cookieStore: Pick<Cookies, "set">) => {
	cookieStore.set(accessTokenCookieName, "", {
		...authCookieOptions,
		maxAge: 0,
	});
	cookieStore.set(refreshTokenCookieName, "", {
		...authCookieOptions,
		maxAge: 0,
	});
};

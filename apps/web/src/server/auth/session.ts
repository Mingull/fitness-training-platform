export const accessTokenCookieName = "access_token";
export const refreshTokenCookieName = "refresh_token";

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
		},
	) => void;
	delete: (name: string) => void;
};

export const getCookie = (cookieStore: Pick<Cookies, "get">, name: string): string | undefined => {
	return cookieStore.get(name)?.value;
};

export const setCookie = (cookieStore: Pick<Cookies, "set">, name: string, value: string, options?: Parameters<Cookies["set"]>[2]) => {
	cookieStore.set(name, value, options);
};

export const clearCookie = (cookieStore: Pick<Cookies, "delete">, name: string) => {
	cookieStore.delete(name);
};

"use server";

import type { ClientResult } from "@fitness/api-client/types";
import { cookies } from "next/headers";
import { refreshAuthTokens } from "./refresh-auth-tokens";
import { accessTokenCookieName, getCookie, refreshTokenCookieName, setCookie } from "./session";

export const refreshSession = async (): Promise<ClientResult<{ accessToken: string; refreshToken: string }>> => {
	const cookieStore = await cookies();
	const refreshToken = getCookie(cookieStore, refreshTokenCookieName);
	const isProduction = process.env.NODE_ENV === "production";

	if (!refreshToken) {
		return {
			data: null,
			error: {
				code: "missing_token",
				message: "Missing refresh token",
				statusCode: 401,
			},
		};
	}

	const result = await refreshAuthTokens(refreshToken);

	if (result.error) {
		return {
			data: null,
			error: result.error,
		};
	}
	const remember = getCookie(cookieStore, "remember") === "true";
	setCookie(cookieStore, accessTokenCookieName, result.data.accessToken, {
		httpOnly: true,
		secure: isProduction,
		sameSite: "lax" as const,
		path: "/",
		maxAge: 60 * 15,
	});
	setCookie(cookieStore, refreshTokenCookieName, result.data.refreshToken, {
		httpOnly: true,
		secure: isProduction,
		sameSite: "lax" as const,
		path: "/",
		maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
	});

	return {
		data: result.data,
		error: null,
	};
};

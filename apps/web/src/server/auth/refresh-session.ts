"use server";

import type { ClientResult } from "@fitness/api-client/types";
import { cookies } from "next/headers";
import { refreshAuthTokens } from "./refresh-auth-tokens";
import { getRefreshToken, setAuthCookies } from "./session";

export const refreshSession = async (): Promise<
	ClientResult<{
		accessToken: string;
		refreshToken: string;
	}>
> => {
	const cookieStore = await cookies();
	const refreshToken = await getRefreshToken(cookieStore);

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

	setAuthCookies(cookieStore, result.data);

	return {
		data: result.data,
		error: null,
	};
};

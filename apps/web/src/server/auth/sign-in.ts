"use server";

import { apiClient } from "@/lib/api-client";
import type { ClientResult } from "@fitness/api-client/types";
import { signinContract } from "@fitness/contracts/auth";
import { cookies } from "next/headers";
import { z } from "zod";
import { accessTokenCookieName, refreshTokenCookieName, setCookie } from "./session";

export const signIn = async (data: z.infer<typeof signinContract>): Promise<ClientResult<{ success: true }>> => {
	const cookieStore = await cookies();
	const result = await apiClient.auth.signIn(data);
	const isProduction = process.env.NODE_ENV === "production";

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
	setCookie(cookieStore, accessTokenCookieName, tokens.accessToken, {
		httpOnly: true,
		secure: isProduction,
		sameSite: "lax" as const,
		path: "/",
		maxAge: 60 * 15,
	});
	setCookie(cookieStore, refreshTokenCookieName, tokens.refreshToken, {
		httpOnly: true,
		secure: isProduction,
		sameSite: "lax" as const,
		path: "/",
		maxAge: data.remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
	});
	setCookie(cookieStore, "remember", data.remember ? "true" : "false", { path: "/" });

	return {
		data: { success: true },
		error: null,
	};
};

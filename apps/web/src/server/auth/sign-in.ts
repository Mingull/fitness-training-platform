"use server";

import { apiClient } from "@/lib/api-client";
import type { ClientResult } from "@fitness/api-client/types";
import { signinContract } from "@fitness/contracts/auth";
import { cookies } from "next/headers";
import { z } from "zod";
import { setAuthCookies } from "./session";

export const signIn = async (data: z.infer<typeof signinContract>): Promise<ClientResult<{ success: true }>> => {
	const cookieStore = await cookies();
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
	setAuthCookies(cookieStore, tokens, { remember: data.remember });

	return {
		data: { success: true },
		error: null,
	};
};

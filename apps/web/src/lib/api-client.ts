import { createApiClient } from "@fitness/api-client";
import { RouteNamespace } from "@fitness/api-client/types";
import { apiErrorContract } from "@fitness/contracts/api-error";
import { apiResponseBaseContract } from "@fitness/contracts/api-response";
import { authTokensContract, signinContract, signupContract } from "@fitness/contracts/auth";
import { profileContract } from "@fitness/contracts/profiles";
import { z } from "zod";

const routes = {
	auth: {
		signIn: {
			method: "POST",
			path: "/auth/sign-in",
			in: signinContract,
			out: authTokensContract,
		},
		signUp: {
			method: "POST",
			path: "/auth/sign-up",
			in: signupContract,
			out: apiResponseBaseContract,
		},
		refresh: {
			method: "POST",
			path: "/auth/refresh",
			in: z.object({ refreshToken: z.string() }),
			out: authTokensContract,
		},
	},
	profiles: {
		me: {
			method: "GET",
			path: "/profiles/me",
			requiresAuth: true,
			out: profileContract,
		},
	},
} as const satisfies RouteNamespace;

if (process.env.NEXT_PUBLIC_API_URL == null) {
	throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
}

export const apiClient = createApiClient({
	baseUrl: process.env.NEXT_PUBLIC_API_URL,
	routes,
	errorSchema: apiErrorContract,
});

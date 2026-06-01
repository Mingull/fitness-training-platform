import { createApiClient } from "@fitness/api-client";
import { RouteNamespace } from "@fitness/api-client/types";
import { apiErrorContract } from "@fitness/contracts/api-error";
import { apiResponseBaseContract } from "@fitness/contracts/api-response";
import { authTokensContract, signinContract, signupContract } from "@fitness/contracts/auth";
import { profileContract, updateProfileContract } from "@fitness/contracts/profiles";
import { trainingPlanListContract } from "@fitness/contracts/training-plans";
import { fetch, FetchRequestInit } from "expo/fetch";
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
		update: {
			method: "PATCH",
			path: "/profiles/me",
			requiresAuth: true,
			in: updateProfileContract,
			out: profileContract,
		},
	},
	plans: {
		list: {
			method: "GET",
			path: "/plans",
			requiresAuth: true,
			out: trainingPlanListContract,
		},
	},
} as const satisfies RouteNamespace;

if (process.env.EXPO_PUBLIC_API_URL == null) {
	throw new Error("EXPO_PUBLIC_API_URL environment variable is not set");
}

export const apiClient = createApiClient({
	baseUrl: process.env.EXPO_PUBLIC_API_URL,
	routes,
	errorSchema: apiErrorContract,
	$fetch: (url, init) => fetch(url, init as FetchRequestInit),
});

import { createApiClient } from "@fitness/api-client";
import { RouteNamespace } from "@fitness/api-client/types";
import { apiErrorContract } from "@fitness/contracts/api-error";
import { apiResponseBaseContract } from "@fitness/contracts/api-response";
import { authTokensContract, signinContract, signupContract } from "@fitness/contracts/auth";
import { trainingPlanContract, trainingPlanListContract } from "@fitness/contracts/training-plans";
import { activatePlanContract, activeUserPlanContract, profileContract, updateProfileContract } from "@fitness/contracts/user";
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
	users: {
		me: {
			profile: {
				method: "GET",
				path: "/users/me/profile",
				auth: "required",
				out: profileContract,
			},
			update: {
				method: "PATCH",
				path: "/users/me/profile",
				auth: "required",
				in: updateProfileContract,
				out: profileContract,
			},
			currentActivePlan: {
				method: "GET",
				path: "/users/me/active-plan",
				auth: "required",
				out: activeUserPlanContract,
			},
			activatePlan: {
				method: "PUT",
				path: "/users/me/active-plan",
				auth: "required",
				in: activatePlanContract,
				out: apiResponseBaseContract,
			},
			deactivatePlan: {
				method: "DELETE",
				path: "/users/me/active-plan",
				auth: "required",
				out: apiResponseBaseContract,
			},
		},
	},
	plans: {
		getOne: {
			method: "GET",
			path: "/plans/{id:string}",
			auth: "optional",
			out: trainingPlanContract,
		},
		list: {
			method: "GET",
			path: "/plans",
			auth: "optional",
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

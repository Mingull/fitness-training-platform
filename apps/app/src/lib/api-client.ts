import { createApiClient } from "@fitness/api-client";
import { RouteNamespace } from "@fitness/api-client/types";
import { apiErrorContract } from "@fitness/contracts/api-error";
import { apiResponseBaseContract } from "@fitness/contracts/api-response";
import { authTokensContract, signinContract, signupContract } from "@fitness/contracts/auth";
import { exerciseListContract } from "@fitness/contracts/exercises";
import {
	addWorkoutToPlanContract,
	createTrainingPlanContract,
	reorderWorkoutsContract,
	trainingPlanContract,
	trainingPlanListContract,
} from "@fitness/contracts/training-plans";
import { activatePlanContract, activeUserPlanContract, profileContract, updateProfileContract } from "@fitness/contracts/user";
import { addExerciseToWorkoutContract, reorderExercisesContract, workoutContract } from "@fitness/contracts/workouts";
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
			path: "/plans/{planId:string}",
			auth: "optional",
			out: trainingPlanContract,
		},
		list: {
			method: "GET",
			path: "/plans",
			auth: "optional",
			out: trainingPlanListContract,
		},
		create: {
			method: "POST",
			path: "/plans",
			auth: "required",
			in: createTrainingPlanContract,
			out: trainingPlanContract,
		},
		addWorkout: {
			method: "POST",
			path: "/plans/{planId:string}/workouts",
			auth: "required",
			in: addWorkoutToPlanContract,
			out: trainingPlanContract,
		},
		reorderWorkouts: {
			method: "PATCH",
			path: "/plans/{planId:string}/reorder-workouts",
			auth: "required",
			in: reorderWorkoutsContract,
			out: trainingPlanContract,
		},
	},
	workouts: {
		getOne: {
			method: "GET",
			path: "/workouts/{workoutId:string}",
			auth: "optional",
			out: workoutContract,
		},
		addExercise: {
			method: "POST",
			path: "/workouts/{workoutId:string}/exercises",
			auth: "required",
			in: addExerciseToWorkoutContract,
			out: workoutContract,
		},
		reorderExercises: {
			method: "PATCH",
			path: "/workouts/{workoutId:string}/reorder-exercises",
			auth: "required",
			in: reorderExercisesContract,
			out: workoutContract,
		},
	},
	exercises: {
		list: {
			method: "GET",
			path: "/exercises",
			auth: "optional",
			out: exerciseListContract,
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

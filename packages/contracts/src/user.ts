import { z } from "zod";
import { apiResponseBaseContract } from "./api-response";
import { trainingPlanItemContract } from "./training-plans";

/**
 * This is the contract for the profile object that will be returned from the API.
 * It is used to validate the data that is returned from the API and to ensure that it is in the correct format.
 */
export const profileContract = apiResponseBaseContract.extend({
	data: z.object({
		id: z.uuidv7(),
		userId: z.uuidv7(),
		username: z.string(),
		email: z.email(),
		roles: z.array(z.enum(["Sporter", "Trainer", "Admin"])),
		firstName: z.string(),
		lastName: z.string(),
		experienceLevel: z.enum(["beginner", "intermediate", "advanced", "professional"]).default("beginner"),
		bio: z.string().optional(),
		goals: z.string().optional(),
		pictureUrl: z.string().optional(),
	}),
});

export type Profile = z.infer<typeof profileContract>;

/**
 * This is the contract for updating the profile object.
 * All fields are optional, as the user may choose to update only a subset of their profile information.
 */
export const updateProfileContract = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	experienceLevel: z.enum(["beginner", "intermediate", "advanced", "professional"]).optional(),
	bio: z.string().optional(),
	goals: z.string().optional(),
	pictureUrl: z.string().optional(),
});

export const activeUserPlanContract = apiResponseBaseContract.extend({
	data: z
		.object({
			plan: trainingPlanItemContract,
			activatedAt: z.iso.datetime(),
		})
		.nullable(),
});
/**
 * This is the TypeScript type for the active training plan of a user that will be returned from the API.
 */
export type ActiveUserPlan = z.infer<typeof activeUserPlanContract>;

/**
 * This is the contract for activating a training plan for the user.
 */
export const activatePlanContract = z.object({ planId: z.string() });

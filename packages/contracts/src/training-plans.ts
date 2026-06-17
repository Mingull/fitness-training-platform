import { z } from "zod";
import { apiResponseBaseContract } from "./api-response";
import { workoutItemContract } from "./workouts";

/**
 * This is the base contract for a training plan item that will be returned from the API.
 */
export const trainingPlanItemContract = z.object({
	id: z.uuidv7(),
	creator: z.object({
		id: z.uuidv7(),
		username: z.string().max(100),
		pictureUrl: z.url().optional(),
	}),
	name: z.string().max(200),
	description: z.string().max(1000),
	difficulty: z.object({
		level: z.int().min(0).max(100),
		label: z.enum(["beginner", "novice", "intermediate", "advanced", "expert"]),
	}),
	estimatedDuration: z.number().int().min(0),
	isPublic: z.boolean(),
	createdAt: z.iso.datetime({ offset: true }),
	updatedAt: z.iso.datetime({ offset: true }).optional().nullable(),
	deletedAt: z.iso.datetime({ offset: true }).optional().nullable(),
});
export type TrainingPlanItem = z.infer<typeof trainingPlanItemContract>;

/**
 * This is the contract for a single training plan that will be returned from the API.
 */
export const trainingPlanContract = apiResponseBaseContract.extend({
	data: trainingPlanItemContract.extend({
		workouts: z.array(workoutItemContract),
	}),
});

/**
 * This is the TypeScript type for a training plan item that will be returned from the API.
 */
export type TrainingPlan = z.infer<typeof trainingPlanContract>;

/**
 * This is the contract for a list of training plans that will be returned from the API.
 */
export const trainingPlanListContract = apiResponseBaseContract.extend({
	data: z.array(trainingPlanItemContract),
});

/**
 * This is the TypeScript type for a list of training plans that will be returned from the API.
 */
export type TrainingPlanList = z.infer<typeof trainingPlanListContract>;

/**
 * This is the contract for the data required to create a new training plan. This will be sent to the API when creating a new training plan.
 */
export const createTrainingPlanContract = z.object({
	name: z.string("name.validations.required").min(2, "name.validations.minLength").max(100, "name.validations.maxLength"),
	description: z.string("description.validations.required").min(2, "description.validations.minLength").max(1000, "description.validations.maxLength"),
	difficulty: z.number().min(0, "difficulty.validations.min").max(100, "difficulty.validations.max"),
	estimatedDuration: z.number().int().min(1, "estimatedDuration.validations.min"),
	isPublic: z.boolean(),
});

/**
 * This is the TypeScript type for the data required to create a new training plan.
 */
export type CreateTrainingPlan = z.infer<typeof createTrainingPlanContract>;

export const addWorkoutToPlanContract = z.object({
	name: z.string("name.validations.required").min(2, "name.validations.minLength").max(100, "name.validations.maxLength"),
});

export type AddWorkoutToPlan = z.infer<typeof addWorkoutToPlanContract>;

export const reorderWorkoutsContract = z.array(
	z.object({
		workoutId: z.uuidv7(),
		newOrderIndex: z.number(),
	}),
);

export type ReorderWorkoutsRequest = z.infer<typeof reorderWorkoutsContract>;

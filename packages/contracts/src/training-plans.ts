import { z } from "zod";
import { apiResponseBaseContract } from "./api-response";

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
	estimatedDuration: z.number().int().min(0),
	isPublic: z.boolean(),
});
export type TrainingPlanItem = z.infer<typeof trainingPlanItemContract>;

/**
 * This is the contract for a single training plan that will be returned from the API.
 */
export const trainingPlanContract = apiResponseBaseContract.extend({
	data: trainingPlanItemContract,
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

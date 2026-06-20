import { z } from "zod";
import { apiResponseBaseContract } from "./api-response";

/**
 * This is the base contract for an exercise item that will be returned from the API.
 */
export const exerciseItemContract = z.object({
	id: z.uuidv7(),
	name: z.string(),
	description: z.string(),
	mediaUrl: z.url().optional().nullable(),
	createdAt: z.iso.datetime({ offset: true }),
	updatedAt: z.iso.datetime({ offset: true }).optional().nullable(),
	deletedAt: z.iso.datetime({ offset: true }).optional().nullable(),
});
/**
 * This is the TypeScript type for an exercise item that will be returned from the API.
 */
export type ExerciseItem = z.infer<typeof exerciseItemContract>;

/**
 * This is the base contract for an exercise item that will be returned from the API.
 */
export const exerciseDetailItemContract = z.object({
	id: z.uuidv7(),
	name: z.string(),
	description: z.string(),
	sets: z.number().min(1),
	reps: z.number().min(1),
	weight: z.number().min(0),
	order: z.number().min(0),
	mediaUrl: z.url().optional().nullable(),
	createdAt: z.iso.datetime({ offset: true }),
	updatedAt: z.iso.datetime({ offset: true }).optional().nullable(),
	deletedAt: z.iso.datetime({ offset: true }).optional().nullable(),
});
/**
 * This is the TypeScript type for an exercise item that will be returned from the API.
 */
export type ExerciseDetailItem = z.infer<typeof exerciseDetailItemContract>;

/**
 * This is the contract for a single exercise that will be returned from the API.
 */
export const exerciseContract = apiResponseBaseContract.extend({
	data: exerciseDetailItemContract,
});

/**
 * This is the TypeScript type for an exercise that will be returned from the API.
 */
export type Exercise = z.infer<typeof exerciseContract>;

/**
 * This is the contract for a list of exercises that will be returned from the API.
 */
export const exerciseListContract = apiResponseBaseContract.extend({
	data: z.array(exerciseItemContract),
});

/**
 * This is the TypeScript type for a list of exercises that will be returned from the API.
 */
export type ExerciseList = z.infer<typeof exerciseListContract>;

export const createExerciseContract = z.object({
	name: z.string("name.validations.required").min(2, "name.validations.minLength").max(100, "name.validations.maxLength"),
	description: z.string("description.validations.required").min(2, "description.validations.minLength").max(1000, "description.validations.maxLength"),
	mediaUrl: z.url("mediaUrl.validations.invalid").optional(),
});

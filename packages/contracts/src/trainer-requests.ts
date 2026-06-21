import { z } from "zod";
import { apiResponseBaseContract } from "./api-response";

/**
 * This is the base contract for a trainer request item that will be returned from the API.
 */
export const trainerRequestItemContract = z.object({
	id: z.uuidv7(),
	sporter: z.object({
		id: z.uuidv7(),
		username: z.string().max(100),
		firstName: z.string().max(100),
		lastName: z.string().max(100),
		pictureUrl: z.url().optional(),
	}),
	trainer: z.object({
		id: z.uuidv7(),
		username: z.string().max(100),
		firstName: z.string().max(100),
		lastName: z.string().max(100),
		pictureUrl: z.url().optional(),
	}),
	status: z.object({
		label: z.enum(["Pending", "Approved", "Rejected"]),
		value: z.enum(["pending", "approved", "rejected"]),
	}),
	message: z.string().optional().nullable(),
	createdAt: z.iso.datetime({ offset: true }),
	updatedAt: z.iso.datetime({ offset: true }).optional().nullable(),
	deletedAt: z.iso.datetime({ offset: true }).optional().nullable(),
});
/**
 * This is the TypeScript type for a trainer request item that will be returned from the API.
 */
export type TrainerRequestItem = z.infer<typeof trainerRequestItemContract>;

/**
 * This is the contract for a single trainer request that will be returned from the API.
 */
export const trainerRequestContract = apiResponseBaseContract.extend({
	data: trainerRequestItemContract,
});

/**
 * This is the TypeScript type for a trainer request that will be returned from the API.
 */
export type TrainerRequest = z.infer<typeof trainerRequestContract>;

/**
 * This is the contract for a list of trainer requests that will be returned from the API.
 */
export const trainerRequestListContract = apiResponseBaseContract.extend({
	data: z.array(trainerRequestItemContract),
});

/**
 * This is the TypeScript type for a list of trainer requests that will be returned from the API.
 */
export type TrainerRequestList = z.infer<typeof trainerRequestListContract>;

export const createTrainerRequestContract = z.object({
	trainerId: z.uuidv7(),
	message: z.string().optional().nullable(),
});

export type CreateTrainerRequest = z.infer<typeof createTrainerRequestContract>;

import { z } from "zod";
import { apiResponseBaseContract } from "./api-response";

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
		roles: z.array(z.union([z.literal("Sporter"), z.literal("Trainer"), z.literal("Admin")])),
		firstName: z.string(),
		lastName: z.string(),
		bio: z.string().nullable(),
		goals: z.string().nullable(),
		experienceLevel: z.string().nullable(),
		pictureUrl: z.string().nullable(),
	})
});


/**
 * This is the contract for updating the profile object. 
 * All fields are optional, as the user may choose to update only a subset of their profile information.
 */
export const updateProfileContract = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	bio: z.string().optional(),
	goals: z.string().optional(),
	experienceLevel: z.string().optional(),
	pictureUrl: z.string().optional(),
});

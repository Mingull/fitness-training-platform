import { z } from "zod";
import { apiResponseBaseContract } from "./api-response";

export const signupContract = z.object({
	firstname: z.string(),
	lastname: z.string(),
	username: z.string(),
	email: z.email(),
	password: z.string(),

	// optional fields
	bio: z.string().optional(),
	goals: z.string().optional(),
	experienceLevel: z.string().optional(),
	picture: z.string().optional(),
});

export const signinContract = z.object({
	email: z.email(),
	password: z.string(),
	remember: z.boolean().optional(),
});

export const authTokensContract = apiResponseBaseContract.extend({
	data: z.object({
		accessToken: z.string(),
		refreshToken: z.string(),
	}),
});

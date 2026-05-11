import { z } from "zod";
import { apiResponseBaseContract } from "./api-response";

export const signupContract = z.object({
	firstname: z.string(),
	lastname: z.string(),
	username: z.string(),
	email: z.email(),
	password: z.string(),
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
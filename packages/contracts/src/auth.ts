import { z } from "zod";

export const registerContract = z.object({
	firstname: z.string(),
	lastname: z.string(),
	username: z.string(),
	email: z.email(),
	password: z.string(),
});

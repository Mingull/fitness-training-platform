import { z } from "zod";

export const apiErrorContract = z.object({
	code: z.string(),
	status: z.number(),
	title: z.string(),
	detail: z.string(),
	type: z.string(),
	instance: z.string().optional(),
	errors: z.record(z.string(), z.array(z.string())).optional(),
});

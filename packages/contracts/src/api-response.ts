import { z } from "zod";

export const apiResponseBaseContract = z.object({
	status: z.number(),
	statusCode: z.string(),
	message: z.string(),
	data: z.unknown().optional(),
});

export type ApiResponseBase = z.infer<typeof apiResponseBaseContract>;

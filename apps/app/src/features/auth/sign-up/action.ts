import { apiClient } from "@/lib/api-client";
import { ClientError, ClientResult } from "@fitness/api-client/types";
import { apiErrorContract } from "@fitness/contracts/api-error";
import { signupContract } from "@fitness/contracts/auth";
import { z } from "zod";

type ErrorPayload = z.infer<typeof apiErrorContract>;

function buildError(payload: ErrorPayload, fallbackMessage: string): ClientError {
	let message: string | undefined = payload?.detail ?? payload?.title;

	if (!message && payload?.errors) {
		const firstError = Object.values(payload.errors)[0];
		if (Array.isArray(firstError) && firstError.length) message = firstError[0];
	}

	return {
		code: "http",
		message: message ?? fallbackMessage,
		statusCode: payload?.status,
		details: payload,
	};
}

export const signUp = async (data: z.infer<typeof signupContract>): Promise<ClientResult<{ success: boolean }>> => {
	const result = await apiClient.auth.signUp(data);

	if (result.error) {
		const parsedError = apiErrorContract.safeParse(result.error.details);
		return {
			data: null,
			error:
				parsedError.success ?
					buildError(parsedError.data, "Failed to sign up.")
				:	{ ...result.error, message: result.error.message || "Failed to sign up." },
		};
	}

	return {
		data: { success: true },
		error: null,
	};
};

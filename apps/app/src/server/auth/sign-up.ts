import { apiErrorContract } from "@fitness/contracts/api-error";
import { registerContract } from "@fitness/contracts/auth";
import { fetch } from "expo/fetch";
import { z } from "zod";
type Result<T> = {
	data: T | null;
	error: {
		status: number;
		statusText: string;
		message?: string | undefined;
	} | null;
};

type ErrorPayload = z.infer<typeof apiErrorContract>;

function buildError(payload: ErrorPayload, statusText: string): Result<never>["error"] {
	let message: string | undefined = payload?.detail ?? payload?.title;
	const status = payload?.status;

	if (!message && payload?.errors) {
		const firstError = Object.values(payload.errors)[0];
		if (Array.isArray(firstError) && firstError.length) message = firstError[0];
	}

	if (!message) message = "Failed to sign up.";
	return { message, status, statusText };
}

export const signUp = async (data: z.infer<typeof registerContract>): Promise<Result<{ token: string }>> => {
	const apiBase = process.env.EXPO_PUBLIC_API_URL;

	if (!apiBase) {
		console.error("EXPO_PUBLIC_API_URL is not configured.");
		return {
			data: null,
			error: {
				message: "An unexpected error occurred. Please try again later.",
				status: 500,
				statusText: "Internal Server Error",
			},
		};
	}

	try {
		const validatedData = registerContract.parse(data);
		const response = await fetch(`${apiBase}/auth/sign-up`, {
			method: "POST",
			body: JSON.stringify(validatedData),
			headers: {
				"Content-Type": "application/json",
			},
		});

		const body = await response.json();

		if (!response.ok) {
			const parsedError = apiErrorContract.safeParse(body);
			if (parsedError.success) {
				return { data: null, error: buildError(parsedError.data, response.statusText) };
			}
			return {
				data: null,
				error: {
					message: "An unexpected error occurred. Please try again later.",
					status: response.status,
					statusText: response.statusText,
				},
			};
		}

		return { data: body as { token: string }, error: null };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				data: null,
				error: {
					message: error.issues.map((issue) => issue.message).join(", "),
					status: 400,
					statusText: "Bad Request",
				},
			};
		}

		console.log({ error });

		return {
			data: null,
			error: {
				message: "An unexpected error occurred. Please try again later.",
				status: 500,
				statusText: "Internal Server Error",
			},
		};
	}
};

import { apiClient } from "@/lib/api-client";
import type { ClientResult } from "@fitness/api-client/types";

export const refreshAuthTokens = async (refreshToken: string): Promise<ClientResult<{ accessToken: string; refreshToken: string }>> => {
	const result = await apiClient.auth.refresh({ refreshToken });

	if (result.error) {
		return {
			data: null,
			error: result.error,
		};
	}

	return {
		data: result.data.data,
		error: null,
	};
};

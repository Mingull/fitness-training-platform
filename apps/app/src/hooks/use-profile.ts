import { useSession } from "@/features/auth/context";
import { apiClient } from "@/lib/api-client";
import { ClientResult } from "@fitness/api-client/types";
import { profileContract } from "@fitness/contracts/profiles";
import { useEffect, useState } from "react";
import { z } from "zod";

export const useProfile = () => {
	const { session, withRefresh } = useSession();
	const [isLoading, setIsLoad] = useState(true);
	const [result, setResult] = useState<ClientResult<z.infer<typeof profileContract.shape.data>> | { data: null; error: null }>({ data: null, error: null });

	useEffect(() => {
		if (!session) {
			setResult({ data: null, error: null });
			setIsLoad(false);
			return;
		}

		const fetchProfile = async () => {
			setIsLoad(true);
			setResult((current) => ({
				data: current.data,
				error: null,
			}));

			const result = await withRefresh((accessToken) => apiClient.profiles.me({ accessToken: accessToken ?? undefined }));
			if (result.error) {
				setResult({ data: null, error: result.error });
			} else {
				setResult({ data: result.data.data, error: null });
			}
			setIsLoad(false);
		};
		// Simulate a short delay to show the loading state (optional)
		new Promise(() =>
			setTimeout(() => {
				fetchProfile();
			}, 1000),
		);
	}, [session, withRefresh]);

	return {
		data: result.data,
		isLoading,
		error: result.error,
	};
};

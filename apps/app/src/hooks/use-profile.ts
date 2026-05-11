import { useSession } from "@/context/auth";
import { apiClient } from "@/lib/api-client";
import { ClientResult } from "@fitness/api-client/types";
import { profileContract } from "@fitness/contracts/profiles";
import { useEffect, useState } from "react";
import { z } from "zod";

export const useProfile = () => {
	const { session } = useSession();
	const [isLoading, setIsLoad] = useState(true);
	const [result, setResult] = useState<ClientResult<z.infer<typeof profileContract>> | { data: null; error: null }>({ data: null, error: null });

	useEffect(() => {
		if (!session) {
			setIsLoad(false);
			return;
		}

		const fetchProfile = async () => {
			setIsLoad(true);
			const result = await apiClient.profiles.me({ accessToken: session });
			if (result.error) {
				setResult({ data: null, error: result.error });
			} else {
				setResult({ data: result.data, error: null });
			}
			setIsLoad(false);
		};

		fetchProfile();
	}, [session]);

	return {
		data: result.data,
		isLoading,
		error: result.error,
	};
};

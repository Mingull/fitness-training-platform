import { useSession } from "@/features/auth/context";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { apiClient } from "@/lib/api-client";
import type { ClientError } from "@fitness/api-client/types";
import type { TrainerRequestList } from "@fitness/contracts/trainer-requests";
import { useQuery } from "@tanstack/react-query";

export const useTrainerRequests = ({ enabled = true }: { enabled?: boolean } = {}) => {
	const { userId } = useSession();
	const { withRefresh } = useAuthActions();
	return useQuery<TrainerRequestList["data"], ClientError>({
		queryKey: ["trainer-requests", userId],
		enabled: !!userId && enabled,
		retry: false,
		// Keep training plans fresh for 5 minutes and cache for 30 minutes
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		queryFn: async ({ signal }) => {
			const result = await withRefresh((accessToken) => apiClient.trainerRequests.list({ accessToken: accessToken ?? undefined, signal }));

			if (result.error) {
				throw result.error;
			}

			return result.data.data;
		},
	});
};

import { useSession } from "@/features/auth/context";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { apiClient } from "@/lib/api-client";
import { ClientError } from "@fitness/api-client/types";
import { TrainingPlanList } from "@fitness/contracts/training-plans";
import { useQuery } from "@tanstack/react-query";

export const useMyTrainingPlans = () => {
	const { userId } = useSession();
	const { withRefresh } = useAuthActions();
	return useQuery<TrainingPlanList["data"], ClientError>({
		queryKey: ["my-training-plans", userId],
		enabled: !!userId,
		retry: false,
		// Keep training plans fresh for 5 minutes and cache for 30 minutes
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		queryFn: async ({ signal }) => {
			const result = await withRefresh((accessToken) => apiClient.users.me.plans({ accessToken: accessToken ?? undefined, signal }));

			if (result.error) {
				throw result.error;
			}

			return result.data.data;
		},
	});
};

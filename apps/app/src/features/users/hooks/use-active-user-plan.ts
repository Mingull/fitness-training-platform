import { useSession } from "@/features/auth/context";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { apiClient } from "@/lib/api-client";
import { ClientError } from "@fitness/api-client/types";
import { ActiveUserPlan } from "@fitness/contracts/user";
import { useQuery } from "@tanstack/react-query";

export const useActiveUserPlan = () => {
	const { userId } = useSession();
	const { withRefresh } = useAuthActions();
	/* eslint-disable-next-line @tanstack/query/exhaustive-deps */
	return useQuery<ActiveUserPlan["data"], ClientError>({
		queryKey: ["active-user-plan", userId],
		enabled: !!userId,
		retry: false,
		// Keep training plans fresh for 5 minutes and cache for 30 minutes
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		queryFn: async ({ signal }) => {
			const result = await withRefresh((accessToken) => apiClient.users.me.currentActivePlan({ accessToken: accessToken ?? undefined, signal }));

			if (result.error) {
				throw result.error;
			}

			return result.data.data;
		},
	});
};

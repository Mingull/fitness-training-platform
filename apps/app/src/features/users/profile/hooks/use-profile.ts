import { useSession } from "@/features/auth/context";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { apiClient } from "@/lib/api-client";
import { ClientError } from "@fitness/api-client/types";
import { Profile } from "@fitness/contracts/user";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
	const { userId } = useSession();
	const { withRefresh } = useAuthActions();
	/* eslint-disable-next-line @tanstack/query/exhaustive-deps */
	return useQuery<Profile["data"], ClientError>({
		queryKey: ["profile", userId],
		enabled: !!userId,
		retry: false,
		// Keep profile data fresh for 5 minutes and cache for 30 minutes
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		queryFn: async ({ signal }) => {
			const result = await withRefresh((accessToken) => apiClient.users.me.profile({ accessToken: accessToken ?? undefined, signal }));

			if (result.error) {
				throw result.error;
			}

			return result.data.data;
		},
	});
};

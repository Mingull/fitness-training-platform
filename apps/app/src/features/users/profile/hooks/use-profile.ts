import { useSession } from "@/features/auth/context";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { apiClient } from "@/lib/api-client";
import { ClientError } from "@fitness/api-client/types";
import { Profile } from "@fitness/contracts/user";
import { useQuery } from "@tanstack/react-query";

export const useProfile = (userId?: string) => {
	const { userId: currentUserId } = useSession();
	const { withRefresh } = useAuthActions();
	/* eslint-disable-next-line @tanstack/query/exhaustive-deps */
	return useQuery<Profile["data"], ClientError>({
		queryKey: ["profile", userId ?? currentUserId],
		enabled: !!userId || !!currentUserId,
		retry: false,
		// Keep profile data fresh for 5 minutes and cache for 30 minutes
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		queryFn: async ({ signal }) => {
			// if the userId if equal to the current user's ID, fetch the profile using the "me" endpoint, otherwise fetch the profile using the user ID
			const result = await withRefresh((accessToken) =>
				userId === undefined ?
					apiClient.users.me.profile({ accessToken: accessToken ?? undefined, signal })
				:	apiClient.users.user.profile({ params: { userId }, accessToken: accessToken ?? undefined, signal }),
			);

			if (result.error) {
				throw result.error;
			}

			return result.data.data;
		},
	});
};

import { useSession } from "@/features/auth/context";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { apiClient } from "@/lib/api-client";
import { ClientError } from "@fitness/api-client/types";
import { ProfileData } from "@fitness/contracts/profiles";
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
	const { userId } = useSession();
	const { withRefresh } = useAuthActions();
	return useQuery<ProfileData["data"], ClientError>({
		queryKey: ["profile", userId],
		enabled: !!userId,
		retry: false,
		// Keep profile data fresh for 5 minutes and cache for 30 minutes
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		queryFn: async ({ signal }) => {
			const result = await withRefresh((accessToken) => apiClient.profiles.me({ accessToken: accessToken ?? undefined, signal }));

			if (result.error) {
				throw result.error;
			}

			return result.data.data;
		},
	});
};

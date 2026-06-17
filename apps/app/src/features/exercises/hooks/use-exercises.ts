import { useSession } from "@/features/auth/context";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { apiClient } from "@/lib/api-client";
import { ClientError } from "@fitness/api-client/types";
import { ExerciseList } from "@fitness/contracts/exercises";
import { useQuery } from "@tanstack/react-query";

export const useExercises = () => {
	const { userId } = useSession();
	const { withRefresh } = useAuthActions();
	return useQuery<ExerciseList["data"], ClientError>({
		queryKey: ["exercises"],
		enabled: !!userId,
		retry: false,
		// Keep exercises fresh for 5 minutes and cache for 30 minutes
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		queryFn: async ({ signal }) => {
			const result = await withRefresh((accessToken) => apiClient.exercises.list({ accessToken: accessToken ?? undefined, signal }));

			if (result.error) {
				throw result.error;
			}

			return result.data.data;
		},
	});
};

import { useSession } from "@/features/auth/context";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { apiClient } from "@/lib/api-client";
import { ClientError } from "@fitness/api-client/types";
import { Profile, updateProfileContract } from "@fitness/contracts/user";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

/**
 * This hook provides a mutation for updating the user's profile information.
 * It uses the `updateProfileContract` to validate the input data and ensures that the profile data is refetched after a successful update.
 * @returns An object containing the mutation function and its state (loading, error, etc.)
 */
export const useUpdateProfile = () => {
	const { userId } = useSession();
	const { withRefresh } = useAuthActions();
	return useMutation<Profile["data"], ClientError, z.infer<typeof updateProfileContract>>({
		mutationFn: async (data) => {
			const result = await withRefresh((accessToken) => apiClient.users.me.update(data, { accessToken: accessToken ?? undefined }));

			if (result.error) {
				throw result.error;
			}

			return result.data.data;
		},
		// Invalidate the profile query to refetch the updated profile data after a successful update
		onSuccess: async (data, variables, onMutateResult, context) => {
			await context.client.invalidateQueries({ queryKey: ["profile", userId, withRefresh] });
		},
	});
};

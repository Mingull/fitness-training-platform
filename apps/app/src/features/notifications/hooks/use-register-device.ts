import { useSession } from "@/features/auth/context";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { apiClient } from "@/lib/api-client";
import { ClientError } from "@fitness/api-client/types";
import { Device, RegisterDevice } from "@fitness/contracts/devices";
import { useMutation } from "@tanstack/react-query";

export const useRegisterDevice = () => {
	const { userId } = useSession();
	const { withRefresh } = useAuthActions();
	return useMutation<Device["data"], ClientError, RegisterDevice>({
		mutationFn: async (data) => {
			const result = await withRefresh((accessToken) => apiClient.devices.register(data, { accessToken: accessToken ?? undefined }));

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

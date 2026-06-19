import { useSession } from "@/features/auth/context";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { apiClient } from "@/lib/api-client";
import { ClientError } from "@fitness/api-client/types";
import { ApiResponseBase } from "@fitness/contracts/api-response";
import { useMutation } from "@tanstack/react-query";

export const useMarkNotificationAsRead = () => {
	const { userId } = useSession();
	const { withRefresh } = useAuthActions();

	return useMutation<ApiResponseBase, ClientError, { notificationId: string }>({
		mutationFn: async ({ notificationId }) => {
			const result = await withRefresh((accessToken) =>
				apiClient.notifications.markRead({ params: { notificationId }, accessToken: accessToken ?? undefined }),
			);

			if (result.error) {
				throw result.error;
			}

			return result.data;
		},
		onSuccess: async (_data, _variables, _onMutateResult, context) => {
			await context.client.invalidateQueries({ queryKey: ["notifications", userId] });
		},
	});
};

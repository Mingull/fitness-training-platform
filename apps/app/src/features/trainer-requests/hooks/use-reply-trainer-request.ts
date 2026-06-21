import { useSession } from "@/features/auth/context";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { apiClient } from "@/lib/api-client";
import { ClientError } from "@fitness/api-client/types";
import { type TrainingPlan } from "@fitness/contracts/training-plans";
import { useMutation } from "@tanstack/react-query";

export const useReplyRequestTrainer = () => {
	const { userId } = useSession();
	const { withRefresh } = useAuthActions();
	return useMutation<
		void,
		ClientError,
		{ reply: "accept" | "reject"; requestId: string; requesterId: string },
		{ previousTrainingPlan?: TrainingPlan["data"] }
	>({
		mutationFn: async (data) => {
			const result = await withRefresh((accessToken) => {
				if (data.reply === "accept") {
					return apiClient.trainerRequests.accept({ params: { requestId: data.requestId }, accessToken: accessToken ?? undefined });
				} else {
					return apiClient.trainerRequests.reject({ params: { requestId: data.requestId }, accessToken: accessToken ?? undefined });
				}
			});

			if (result.error) {
				throw result.error;
			}
		},
		onSettled: async (data, error, variables, onMutateResult, context) => {
			await context.client.invalidateQueries({ queryKey: ["request-trainer-status", userId, variables.requesterId] });
			await context.client.invalidateQueries({ queryKey: ["trainer-requests", userId] });
		},
	});
};

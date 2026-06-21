import { useSession } from "@/features/auth/context";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { apiClient } from "@/lib/api-client";
import { ClientError } from "@fitness/api-client/types";
import { type CreateTrainerRequest, type TrainerRequest } from "@fitness/contracts/trainer-requests";
import { type TrainingPlan } from "@fitness/contracts/training-plans";
import { useMutation } from "@tanstack/react-query";

export const useRequestTrainer = () => {
	const { userId } = useSession();
	const { withRefresh } = useAuthActions();
	return useMutation<TrainerRequest["data"], ClientError, CreateTrainerRequest, { previousTrainingPlan?: TrainingPlan["data"] }>({
		mutationFn: async (data) => {
			const result = await withRefresh((accessToken) => apiClient.trainerRequests.request(data, { accessToken: accessToken ?? undefined }));

			if (result.error) {
				throw result.error;
			}

			return result.data.data;
		},
		onSettled: async (data, error, variables, onMutateResult, context) => {
			await context.client.invalidateQueries({ queryKey: ["request-trainer-status", variables.trainerId, userId] });
		},
	});
};

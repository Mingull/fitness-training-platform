import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { apiClient } from "@/lib/api-client";
import { ClientError } from "@fitness/api-client/types";
import { CreateTrainerRequest, TrainerRequest } from "@fitness/contracts/trainer-requests";
import { TrainingPlan } from "@fitness/contracts/training-plans";
import { useMutation } from "@tanstack/react-query";

export const useRequestTraining = () => {
	const { withRefresh } = useAuthActions();
	return useMutation<TrainerRequest["data"], ClientError, CreateTrainerRequest, { previousTrainingPlan?: TrainingPlan["data"] }>({
		mutationFn: async (data) => {
			const result = await withRefresh((accessToken) => apiClient.trainerRequests.request(data, { accessToken: accessToken ?? undefined }));

			if (result.error) {
				throw result.error;
			}

			return result.data.data;
		},
	});
};

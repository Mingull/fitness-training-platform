import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { apiClient } from "@/lib/api-client";
import { ClientError } from "@fitness/api-client/types";
import { AddWorkoutToPlan, TrainingPlan } from "@fitness/contracts/training-plans";
import { useMutation } from "@tanstack/react-query";

export const useAddWorkout = (planId: string) => {
	const { withRefresh } = useAuthActions();
	return useMutation<TrainingPlan["data"], ClientError, AddWorkoutToPlan, { previousTrainingPlan?: TrainingPlan["data"] }>({
		mutationFn: async (data) => {
			const result = await withRefresh((accessToken) => apiClient.plans.addWorkout(data, { params: { planId }, accessToken: accessToken ?? undefined }));

			if (result.error) {
				throw result.error;
			}

			return result.data.data;
		},
		onMutate: async (data, context) => {
			await context.client.cancelQueries({ queryKey: ["training-plan", planId] });

			const previousTrainingPlan = context.client.getQueryData<TrainingPlan["data"]>(["training-plan", planId]);

			if (previousTrainingPlan) {
				const nextOrder = previousTrainingPlan.workouts.reduce((maxOrder, workout) => Math.max(maxOrder, workout.order), -1) + 1;
				const optimisticWorkout = {
					id: "00000000-0000-0000-0000-000000000000",
					name: data.name,
					order: nextOrder,
				} as TrainingPlan["data"]["workouts"][number];

				context.client.setQueryData<TrainingPlan["data"]>(["training-plan", planId], {
					...previousTrainingPlan,
					workouts: [...previousTrainingPlan.workouts, optimisticWorkout],
				});
			}

			return { previousTrainingPlan };
		},
		onError: (_error, _variables, onMutateResult, context) => {
			if (onMutateResult?.previousTrainingPlan) {
				context.client.setQueryData(["training-plan", planId], onMutateResult.previousTrainingPlan);
			}
		},
		onSettled: async (_data, _error, _variables, _onMutateResult, context) => {
			await context.client.invalidateQueries({ queryKey: ["training-plan", planId] });
		},
	});
};

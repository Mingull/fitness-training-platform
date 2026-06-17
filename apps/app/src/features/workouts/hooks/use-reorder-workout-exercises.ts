import { useSession } from "@/features/auth/context";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { apiClient } from "@/lib/api-client";
import { ClientError } from "@fitness/api-client/types";
import { ReorderExercisesRequest, Workout } from "@fitness/contracts/workouts";
import { useMutation } from "@tanstack/react-query";

export const useReorderWorkoutExercises = (workoutId: string) => {
	const { userId } = useSession();
	const { withRefresh } = useAuthActions();
	const workoutQueryKey = ["workout", workoutId] as const;
	return useMutation<Workout["data"], ClientError, ReorderExercisesRequest, { previousWorkout?: Workout["data"] }>({
		mutationFn: async (data) => {
			const result = await withRefresh((accessToken) =>
				apiClient.workouts.reorderExercises(data, { params: { workoutId }, accessToken: accessToken ?? undefined }),
			);

			if (result.error) {
				throw result.error;
			}

			return result.data.data;
		},
		onMutate: async (data, context) => {
			await context.client.cancelQueries({ queryKey: workoutQueryKey });

			const previousWorkout = context.client.getQueriesData<Workout["data"]>({ queryKey: workoutQueryKey })[0]?.[1];

			if (previousWorkout) {
				const newOrderByExerciseId = new Map(data.map((item) => [item.exerciseId, item.newOrderIndex]));

				const reorderedExercises = [...previousWorkout.exercises]
					.map((exercise) => ({
						...exercise,
						order: newOrderByExerciseId.get(exercise.id) ?? exercise.order,
					}))
					.sort((a, b) => a.order - b.order);

				context.client.setQueriesData<Workout["data"]>({ queryKey: workoutQueryKey }, (currentWorkout) => {
					if (!currentWorkout) {
						return currentWorkout;
					}

					return {
						...currentWorkout,
						exercises: reorderedExercises,
					};
				});
			}

			return { previousWorkout };
		},
		onError: (_error, _variables, onMutateResult, context) => {
			if (onMutateResult?.previousWorkout) {
				context.client.setQueriesData({ queryKey: workoutQueryKey }, onMutateResult.previousWorkout);
			}
		},
		onSuccess: async (data, _variables, _onMutateResult, context) => {
			context.client.setQueriesData({ queryKey: workoutQueryKey }, data);
			await context.client.invalidateQueries({ queryKey: workoutQueryKey });
		},
	});
};

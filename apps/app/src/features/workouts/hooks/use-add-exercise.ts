import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { apiClient } from "@/lib/api-client";
import { ClientError } from "@fitness/api-client/types";
import { AddExerciseToWorkout, Workout, WorkoutItem } from "@fitness/contracts/workouts";
import { useMutation } from "@tanstack/react-query";

export const useAddExercise = (workoutId: string) => {
	const { withRefresh } = useAuthActions();
	return useMutation<Workout["data"], ClientError, AddExerciseToWorkout, { previousWorkout?: Workout["data"] }>({
		mutationFn: async (data) => {
			const result = await withRefresh((accessToken) =>
				apiClient.workouts.addExercise(data, { params: { workoutId }, accessToken: accessToken ?? undefined }),
			);

			if (result.error) {
				throw result.error;
			}

			return result.data.data;
		},
		onMutate: async (data, context) => {
			await context.client.cancelQueries({ queryKey: ["workout", workoutId] });

			const previousWorkout = context.client.getQueryData<Workout["data"]>(["workout", workoutId]);

			if (previousWorkout) {
				const nextOrder = previousWorkout.exercises.reduce((maxOrder, exercise) => Math.max(maxOrder, exercise.order), -1) + 1;
				const optimisticExercise = {
					id: "00000000-0000-0000-0000-000000000000",
					order: nextOrder,
				} as Workout["data"]["exercises"][number];

				context.client.setQueryData<Workout["data"]>(["workout", workoutId], {
					...previousWorkout,
					exercises: [...previousWorkout.exercises, optimisticExercise],
				});
			}

			return { previousWorkout };
		},
		onError: (_error, _variables, onMutateResult, context) => {
			if (onMutateResult?.previousWorkout) {
				context.client.setQueryData(["workout", workoutId], onMutateResult.previousWorkout);
			}
		},
		onSettled: async (_data, _error, _variables, _onMutateResult, context) => {
			await context.client.invalidateQueries({ queryKey: ["workout", workoutId] });
		},
	});
};

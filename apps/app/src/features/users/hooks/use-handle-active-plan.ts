import { useSession } from "@/features/auth/context";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { apiClient } from "@/lib/api-client";
import { ClientError } from "@fitness/api-client/types";
import { TrainingPlan } from "@fitness/contracts/training-plans";
import { activatePlanContract, ActiveUserPlan } from "@fitness/contracts/user";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

/**
 * This hook provides a mutation for activating and deactivating the user's active training plan.
 * It uses the `activatePlanContract` to validate the input data for activating a plan and ensures that the active plan data is refetched after a successful activation or deactivation.
 * @returns An object containing the mutation functions for activating and deactivating the active plan, along with their state (loading, error, etc.)
 */
export const useHandleActivePlan = () => {
	const { userId } = useSession();
	const { withRefresh } = useAuthActions();

	const activatePlanMutation = useMutation<void, ClientError, z.infer<typeof activatePlanContract>, { previousActivePlan: ActiveUserPlan["data"] }>({
		mutationFn: async (data) => {
			const result = await withRefresh((accessToken) =>
				apiClient.users.me.activatePlan({ planId: data.planId }, { accessToken: accessToken ?? undefined }),
			);

			if (result.error) {
				throw result.error;
			}
		},
		onMutate: async (data, context) => {
			await context.client.cancelQueries({ queryKey: ["active-user-plan", userId] });

			const previousActivePlan = context.client.getQueryData<ActiveUserPlan["data"]>(["active-user-plan", userId]);
			const optimisticPlan = context.client.getQueryData<TrainingPlan["data"]>(["training-plan", data.planId, withRefresh]);

			if (optimisticPlan) {
				context.client.setQueryData<ActiveUserPlan["data"]>(["active-user-plan", userId], () => ({
					plan: optimisticPlan,
					activatedAt: new Date().toISOString(),
				}));
			}

			return { previousActivePlan: previousActivePlan ?? null };
		},
		onError: (_error, _variables, onMutateResult, context) => {
			context.client.setQueryData(["active-user-plan", userId], onMutateResult?.previousActivePlan ?? null);
		},
		onSettled: async (_data, _error, _variables, _onMutateResult, context) => {
			await context.client.invalidateQueries({ queryKey: ["active-user-plan", userId] });
		},
	});

	const deactivatePlanMutation = useMutation<void, ClientError, void, { previousActivePlan: ActiveUserPlan["data"] }>({
		mutationFn: async () => {
			const result = await withRefresh((accessToken) => apiClient.users.me.deactivatePlan({ accessToken: accessToken ?? undefined }));

			if (result.error) {
				throw result.error;
			}
		},
		onMutate: async (_variables, context) => {
			await context.client.cancelQueries({ queryKey: ["active-user-plan", userId] });

			const previousActivePlan = context.client.getQueryData<ActiveUserPlan["data"]>(["active-user-plan", userId]);

			context.client.setQueryData(["active-user-plan", userId], () => null);

			return { previousActivePlan: previousActivePlan ?? null };
		},
		onError: (_error, _variables, onMutateResult, context) => {
			context.client.setQueryData(["active-user-plan", userId], onMutateResult?.previousActivePlan ?? null);
		},
		onSettled: async (_data, _error, _variables, _onMutateResult, context) => {
			await context.client.invalidateQueries({ queryKey: ["active-user-plan", userId] });
		},
	});

	return {
		activate: activatePlanMutation.mutate,
		activateAsync: activatePlanMutation.mutateAsync,
		deactivate: deactivatePlanMutation.mutate,
		deactivateAsync: deactivatePlanMutation.mutateAsync,
		isLoading: activatePlanMutation.isPending || deactivatePlanMutation.isPending,
	};
};

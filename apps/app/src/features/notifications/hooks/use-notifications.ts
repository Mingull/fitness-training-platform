import { useSession } from "@/features/auth/context";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { apiClient } from "@/lib/api-client";
import { ClientError } from "@fitness/api-client/types";
import { NotificationList } from "@fitness/contracts/notifications";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

export const useNotifications = () => {
	const { userId } = useSession();
	const { withRefresh } = useAuthActions();

	const query = useQuery<NotificationList["data"], ClientError>({
		queryKey: ["notifications", userId],
		enabled: !!userId,
		retry: false,
		staleTime: 1000 * 30,
		refetchOnWindowFocus: false,
		queryFn: async ({ signal }) => {
			const result = await withRefresh((accessToken) => apiClient.notifications.list({ accessToken: accessToken ?? undefined, signal }));

			if (result.error) {
				throw result.error;
			}

			return result.data.data;
		},
	});

	const unreadCount = useMemo(() => (query.data ?? []).filter((notification) => !notification.readAt).length, [query.data]);

	return {
		...query,
		unreadCount,
	};
};

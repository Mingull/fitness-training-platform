import { ClientResult } from "@fitness/api-client/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAccessToken } from "./auth/session";

export const withAuthRedirect = async <R>({ fn, target }: { target: string; fn: () => Promise<ClientResult<R>> | ClientResult<R> }) => {
	const cookieStore = await cookies();
	const accessToken = getAccessToken(cookieStore);
	const refreshTarget = `/api/auth/refresh?next=${encodeURIComponent(target)}`;

	if (!accessToken) {
		redirect(refreshTarget);
	}

	const result = await fn();

	if (result.error && (result.error.code === "missing_token" || (result.error.code === "http" && result.error.statusCode === 401))) {
		redirect(refreshTarget);
	}

	return result;
};

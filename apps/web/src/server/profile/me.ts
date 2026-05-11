import { apiClient } from "@/lib/api-client";
import type { ClientResult } from "@fitness/api-client/types";
import { profileContract } from "@fitness/contracts/profiles";
import { cookies } from "next/headers";
import { z } from "zod";
import { getAccessToken } from "../auth/session";
import { withAuthRedirect } from "../with-auth-redirect";

export const getProfile = async (locale: string): Promise<ClientResult<z.infer<typeof profileContract>>> => {
	const cookieStore = await cookies();
	const accessToken = getAccessToken(cookieStore);

	return withAuthRedirect({ fn: () => apiClient.profiles.me({ accessToken }), target: `/${locale}/profile` });
};

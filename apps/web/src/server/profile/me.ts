import { apiClient } from "@/lib/api-client";
import type { ClientResult } from "@fitness/api-client/types";
import { profileContract } from "@fitness/contracts/profiles";
import { cookies } from "next/headers";
import { z } from "zod";
import { accessTokenCookieName, getCookie } from "../auth/session";
import { withAuthRedirect } from "../with-auth-redirect";

export const getProfile = async (locale: string): Promise<ClientResult<z.infer<typeof profileContract>>> => {
	const cookieStore = await cookies();
	const accessToken = getCookie(cookieStore, accessTokenCookieName);

	return withAuthRedirect({ fn: () => apiClient.profiles.me({ accessToken }), target: `/${locale}/profile` });
};

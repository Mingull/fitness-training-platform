import { refreshSession } from "@/server/auth/refresh-session";
import { clearAuthCookies, getRefreshToken, setAuthCookies } from "@/server/auth/session";
import { NextRequest, NextResponse } from "next/server";

const sanitizeReturnTo = (value: string | null) => {
	if (!value || !value.startsWith("/")) {
		return "/";
	}

	return value;
};

export async function GET(request: NextRequest) {
	const nextPath = sanitizeReturnTo(request.nextUrl.searchParams.get("next"));
	const refreshToken = getRefreshToken(request.cookies);

	if (!refreshToken) {
		const response = NextResponse.redirect(new URL("/sign-in", request.url));
		clearAuthCookies(response.cookies);
		return response;
	}

	const result = await refreshSession();
	if (result.error || !result.data) {
		const response = NextResponse.redirect(new URL("/sign-in", request.url));
		clearAuthCookies(response.cookies);
		return response;
	}

	const response = NextResponse.redirect(new URL(nextPath, request.url));
	setAuthCookies(response.cookies, result.data);
	return response;
}

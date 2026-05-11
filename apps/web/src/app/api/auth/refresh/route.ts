import { refreshSession } from "@/server/auth/refresh-session";
import { clearAuthCookies, getRefreshToken, setAuthCookies } from "@/server/auth/session";
import { NextRequest, NextResponse } from "next/server";

/** Ensures refresh redirects stay on a safe in-app path. */
const sanitizeReturnTo = (value: string | null) => {
	if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
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

	const response = NextResponse.redirect(new URL(nextPath, request.nextUrl.origin));
	setAuthCookies(response.cookies, result.data, { remember: true });
	return response;
}

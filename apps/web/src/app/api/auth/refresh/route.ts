import { refreshSession } from "@/server/auth/refresh-session";
import { accessTokenCookieName, clearCookie, getCookie, refreshTokenCookieName, setCookie } from "@/server/auth/session";
import { NextRequest, NextResponse } from "next/server";

const sanitizeReturnTo = (value: string | null) => {
	if (!value || !value.startsWith("/")) {
		return "/";
	}

	return value;
};

export async function GET(request: NextRequest) {
	const nextPath = sanitizeReturnTo(request.nextUrl.searchParams.get("next"));
	const refreshToken = getCookie(request.cookies, refreshTokenCookieName);

	if (!refreshToken) {
		const response = NextResponse.redirect(new URL("/sign-in", request.url));
		clearCookie(response.cookies, accessTokenCookieName);
		clearCookie(response.cookies, refreshTokenCookieName);
		return response;
	}

	const result = await refreshSession();
	if (result.error || !result.data) {
		const response = NextResponse.redirect(new URL("/sign-in", request.url));
		clearCookie(response.cookies, accessTokenCookieName);
		clearCookie(response.cookies, refreshTokenCookieName);
		return response;
	}

	const response = NextResponse.redirect(new URL(nextPath, request.url));
	const remember = getCookie(request.cookies, "remember");
	setCookie(response.cookies, accessTokenCookieName, result.data.accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax" as const,
		path: "/",
		maxAge: 60 * 15,
	});
	setCookie(response.cookies, refreshTokenCookieName, result.data.refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax" as const,
		path: "/",
		maxAge: remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
	});
	return response;
}

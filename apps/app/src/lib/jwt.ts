import type { JWTPayload } from "jose";

function base64UrlDecode(input: string): string {
	const base64 = input
		.replace(/-/g, "+")
		.replace(/_/g, "/")
		.padEnd(Math.ceil(input.length / 4) * 4, "=");

	const binary = atob(base64);

	return decodeURIComponent(
		binary
			.split("")
			.map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
			.join(""),
	);
}

export async function decryptJWT<P = JWTPayload>(token: string): Promise<P & JWTPayload> {
	const parts = token.split(".");
	if (parts.length !== 3) {
		throw new Error("Invalid JWT structure");
	}

	const json = base64UrlDecode(parts[1]);

	return JSON.parse(json) as P & JWTPayload;
}

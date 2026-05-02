import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	/* config options here */
	cacheComponents: true,
	images: {
		unoptimized: process.env.NODE_ENV !== "production", // Disable optimization in development for faster builds
		remotePatterns: [
			new URL(process.env.BASE_API_URL ? `${process.env.BASE_API_URL}/**` : "http://localhost:3001/**"), // Allow all images from the API URL
		],
	},
	allowedDevOrigins: ["192.168.178.126"],
	reactStrictMode: true,
};

const withNextIntl = createNextIntlPlugin({
	experimental: {
		createMessagesDeclaration: ["./messages/nl.json", "./messages/en.json"],
	},
});
export default withNextIntl(nextConfig);

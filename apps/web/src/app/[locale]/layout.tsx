import { IntlProvider } from "@/components/intl-provider";
import { Providers } from "@/components/providers";
import { routing } from "@/i18n/routing";
import "@fitness/ui/globals.css";
import { cn } from "@fitness/ui/lib/utils";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
	title: "Fitness Trainer platform",
	description: "A platform for fitness trainers to manage their clients and workouts.",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[locale]">) {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={cn("bg-background text-foreground flex min-h-screen flex-col font-sans antialiased", inter.variable)}>
				<Suspense>
					<IntlProvider locale={locale}>
						<Providers>{children}</Providers>
					</IntlProvider>
				</Suspense>
			</body>
		</html>
	);
}

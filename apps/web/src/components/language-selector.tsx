"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@fitness/ui/components/button";
import { useLocale } from "next-intl";
import { usePathname as useNextPathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import ReactCountryFlag from "react-country-flag";

export function LanguageSelector({ size }: { size?: "default" | "sm" }) {
	const locale = useLocale();
	const pathname = usePathname();
	const nextPathname = useNextPathname();
	const searchParams = useSearchParams();

	function extractParams<T extends string>(dynamicPath: T, actualPath: string): Record<ExtractParams<T>, string> {
		const dynamicSegments = dynamicPath.split("/").filter(Boolean);
		const actualSegments = actualPath
			.replace(/\/(nl|en)/, "")
			.split("/")
			.filter(Boolean);

		const params: Record<string, string> = {};

		dynamicSegments.forEach((segment, i) => {
			if (segment.startsWith("[") && segment.endsWith("]")) {
				const key = segment.slice(1, -1) as ExtractParams<T>;
				params[key] = actualSegments[i] ?? "";
			}
		});

		return params;
	}

	const isDynamicRoute = pathname.includes("[") && pathname.includes("]");
	const params = isDynamicRoute ? extractParams(pathname, nextPathname) : undefined;
	const query = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);

	const href =
		params ?
			{ pathname: pathname as ExtractDynamicPath<typeof pathname>, params, query }
		:	{ pathname: pathname as ExtractStaticPath<typeof pathname>, query };

	return (
		<Button size={size ?? "sm"} variant="ghost" aria-label="Switch language" asChild>
			<Link href={href} locale={locale === "en" ? "nl" : "en"}>
				<ReactCountryFlag
					countryCode={locale === "en" ? "GB" : "NL"}
					className="h-6 w-6 md:h-4 md:w-4"
					svg
					style={{ width: size === "sm" ? "1rem" : "1.5rem", height: size === "sm" ? "1rem" : "1.5rem" }}
				/>
			</Link>
		</Button>
	);
}

type DynamicPath<T extends string> =
	T extends `[...${infer Param}]` ? Param
	: T extends `[[...${infer Param}]]` ? Param
	: T extends `[${infer Param}]` ? Param
	: never;

type ExtractParams<T extends string> = T extends `${infer Head}/${infer Tail}` ? DynamicPath<Head> | ExtractParams<Tail> : DynamicPath<T>;

type ExtractDynamicPath<T extends string> =
	T extends `${string}[...${string}]${string}` ? T
	: T extends `${string}[[...${string}]]${string}` ? T
	: T extends `${string}[${string}]${string}` ? T
	: never;

type ExtractStaticPath<T extends string> =
	T extends string ?
		T extends `${string}[${string}]${string}` ?
			never
		:	T
	:	never;

import { formatHex, parse } from "culori";
import { DarkTheme, DefaultTheme, type Theme } from "expo-router/react-navigation";
import { TOKENS } from "./tokens";

function convertColor(color: string) {
	const parsed = parse(color);
	if (!parsed) return color;
	return formatHex(parsed);
}

function resolveTheme<T extends typeof TOKENS.light | typeof TOKENS.dark>(theme: T): T {
	return Object.fromEntries(Object.entries(theme).map(([key, value]) => [key, typeof value === "string" ? convertColor(value) : value])) as T;
}

export const THEME = {
	light: resolveTheme(TOKENS.light),
	dark: resolveTheme(TOKENS.dark),
};

function createNavTheme<T extends typeof THEME.light | typeof THEME.dark>(base: Theme, t: T): Theme {
	return {
		...base,
		colors: {
			...base.colors,
			background: t.background,
			border: t.border,
			card: t.card,
			primary: t.primary,
			text: t.foreground,
			notification: t.destructive,
		},
	};
}

export const NAV_THEME = {
	light: createNavTheme(DefaultTheme, THEME.light),
	dark: createNavTheme(DarkTheme, THEME.dark),
};

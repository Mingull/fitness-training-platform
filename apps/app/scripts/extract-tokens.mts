// This is a standalone script to extract CSS variables from the global stylesheet and output them as a TypeScript file for use in the app's theme system.
// It handles both light and dark mode tokens defined in the CSS.
import { formatHsl, parse } from "culori";
// @ts-ignore - This is a Node.js script, so we can use the built-in fs module to read and write files.
import * as fs from "node:fs";
const CSS_FILE = "src/globals.css";
const OUTPUT_FILE = "src/lib/theme/tokens.ts";

const css = fs.readFileSync(CSS_FILE, "utf8");

// -----------------------------
// helpers
// -----------------------------
function extractBlock(input: string, selector: string) {
	const selectorIndex = input.indexOf(selector);
	if (selectorIndex === -1) {
		return "";
	}

	const blockStart = input.indexOf("{", selectorIndex);
	if (blockStart === -1) {
		return "";
	}

	let depth = 0;
	for (let i = blockStart; i < input.length; i++) {
		const char = input[i];

		if (char === "{") {
			depth += 1;
			continue;
		}

		if (char === "}") {
			depth -= 1;
			if (depth === 0) {
				return input.slice(blockStart + 1, i);
			}
		}
	}

	return "";
}

function extractDarkMediaBlock(input: string) {
	const mediaRegex = /@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)/m;
	const mediaMatch = mediaRegex.exec(input);
	if (!mediaMatch || mediaMatch.index === undefined) {
		return "";
	}

	const mediaStart = mediaMatch.index;
	const openBrace = input.indexOf("{", mediaStart);
	if (openBrace === -1) {
		return "";
	}

	let depth = 0;
	for (let i = openBrace; i < input.length; i++) {
		const char = input[i];

		if (char === "{") {
			depth += 1;
			continue;
		}

		if (char === "}") {
			depth -= 1;
			if (depth === 0) {
				return input.slice(openBrace + 1, i);
			}
		}
	}

	return "";
}

function extractVars(block: string) {
	const regex = /--([a-zA-Z0-9-]+):\s*([^;]+);/g;

	const result: Record<string, string> = {};

	function toCamel(key: string) {
		return key.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
	}

	let match;
	while ((match = regex.exec(block)) !== null) {
		const key = match[1];
		const value = match[2].trim();

		const parsed = parse(value);
		const camel = toCamel(key);
		result[camel] = parsed ? formatHsl(parsed) : value;
	}

	return result;
}

// -----------------------------
// extract light
// -----------------------------
const lightBlock = extractBlock(css, ":root");

// -----------------------------
// extract dark (inside media query)
// -----------------------------
const darkMediaBlock = extractDarkMediaBlock(css);
const darkBlock = darkMediaBlock ? extractBlock(darkMediaBlock, ":root") : "";

// -----------------------------
// build tokens
// -----------------------------
const tokens = {
	light: extractVars(lightBlock),
	dark: extractVars(darkBlock),
};

// console.log(tokens);

// -----------------------------
// write output
// -----------------------------
const output = `// AUTO-GENERATED FILE — DO NOT EDIT

export const TOKENS = ${JSON.stringify(tokens, null, 2)} as const;
`;

fs.writeFileSync(OUTPUT_FILE, output);

console.log("✅ Theme tokens extracted (light + dark)");

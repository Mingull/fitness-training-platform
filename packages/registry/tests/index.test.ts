import { describe, expect, it } from "vitest";

import { createLibraryRegistry } from "../src/index";

describe("createLibraryRegistry", () => {
	it("resolves aliases to canonical node names", async () => {
		const registry = createLibraryRegistry({
			NextJsIcon: {
				value: async () => "next-js-icon",
				aliases: ["NextJs", "next-icon"],
			},
		});

		const typedAliasKey: keyof typeof registry.nodes = "NextJs";
		expect(typedAliasKey in registry.nodes).toBe(true);

		expect(await registry.get("NextJs")).toBe("next-js-icon");
		expect(await registry.get("NEXT-ICON")).toBe("next-js-icon");
		expect(await registry.get("nextjsicon")).toBe("next-js-icon");
		expect("next-icon" in registry.nodes).toBe(true);
	});

	it("throws when aliases conflict across nodes", () => {
		expect(() =>
			createLibraryRegistry({
				NextJsIcon: {
					value: async () => "next-js-icon",
					aliases: ["next"],
				},
				NodeJsIcon: {
					value: async () => "node-js-icon",
					aliases: ["NEXT"],
				},
			}),
		).toThrow(/Alias conflict/);
	});

	it("resolves node names case-insensitively", async () => {
		const registry = createLibraryRegistry({
			NextJsIcon: async () => "next-js-icon",
			NodeJsIcon: async () => "node-js-icon",
		});

		const lower = await registry.get("nextjsicon");
		const upper = await registry.get("NEXTJSICON");
		const canonical = await registry.get("NextJsIcon");

		expect(lower).toBe("next-js-icon");
		expect(upper).toBe("next-js-icon");
		expect(canonical).toBe("next-js-icon");
	});

	it("returns null synchronously before preload and then gives value", async () => {
		const registry = createLibraryRegistry({
			NextJsIcon: async () => "next-js-icon",
		});

		expect(registry.getSync("nextjsicon")).toBeNull();
		await registry.preload("NEXTJSICON");
		expect(registry.getSync("NextJsIcon")).toBe("next-js-icon");
	});
});

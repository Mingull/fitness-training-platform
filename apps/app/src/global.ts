import enMessages from "../messages/en.json";
import nlMessages from "../messages/nl.json";

declare module "use-intl" {
	interface AppConfig {
		Locale: "en" | "nl";
		Messages: typeof nlMessages | typeof enMessages;
	}
}

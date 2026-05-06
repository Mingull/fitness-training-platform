import enMessages from "../messages/en.json";
import nlMessages from "../messages/nl.json";

declare module "use-intl" {
	interface AppConfig {
		Messages: typeof nlMessages | typeof enMessages;
	}
}

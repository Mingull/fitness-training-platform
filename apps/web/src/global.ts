import { routing } from "@/i18n/routing";
import nlMessages from "../messages/nl.json";
import enMessages from "../messages/en.json";

declare module "next-intl" {
	interface AppConfig {
		Locale: (typeof routing.locales)[number];
		Messages: typeof nlMessages | typeof enMessages;
	}
}

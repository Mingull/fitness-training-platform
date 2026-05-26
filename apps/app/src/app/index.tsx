import { getLocales } from "expo-localization";
import { Redirect } from "expo-router";

const deviceLocale = getLocales()[0];
const locale = deviceLocale?.languageCode === "nl" ? "nl" : "en";

export default function RootIndex() {
	return <Redirect href={{ pathname: "/[locale]", params: { locale } }} />;
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { ArrowRight, BarChart3, Dumbbell, ShieldCheck, Timer } from "lucide-react-native";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslations } from "use-intl";

export default function Onboarding() {
	const t = useTranslations("onboarding");

	return (
		<SafeAreaView>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<View className="mt-4 mb-4">
					<Card className="h-full">
						<CardHeader>
							<View className="bg-primary/10 border-primary/10 h-18 w-18 items-center justify-center rounded-[28px] border">
								<Icon as={Dumbbell} size={30} />
							</View>
							<View className="items-center gap-2">
								<Text className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">{t("eyebrow")}</Text>
								<CardTitle className="text-center text-3xl leading-tight">{t("title")}</CardTitle>
								<CardDescription className="text-center text-base leading-6">{t("subtitle")}</CardDescription>
							</View>
						</CardHeader>
						<CardContent className="gap-6 pt-4">
							<View className="bg-muted/40 rounded-3xl p-4">
								<View className="flex-row items-start gap-3 py-2">
									<View className="bg-primary/10 mt-0.5 h-9 w-9 items-center justify-center rounded-full">
										<Icon as={BarChart3} size={18} />
									</View>
									<View className="flex-1 gap-0.5">
										<Text className="text-foreground text-base font-medium">{t("features.progress.title")}</Text>
										<Text className="text-muted-foreground text-sm leading-5">{t("features.progress.description")}</Text>
									</View>
								</View>

								<View className="bg-border/60 my-1 h-px" />

								<View className="flex-row items-start gap-3 py-2">
									<View className="bg-primary/10 mt-0.5 h-9 w-9 items-center justify-center rounded-full">
										<Icon as={Timer} size={18} />
									</View>
									<View className="flex-1 gap-0.5">
										<Text className="text-foreground text-base font-medium">{t("features.fast.title")}</Text>
										<Text className="text-muted-foreground text-sm leading-5">{t("features.fast.description")}</Text>
									</View>
								</View>

								<View className="bg-border/60 my-1 h-px" />

								<View className="flex-row items-start gap-3 py-2">
									<View className="bg-primary/10 mt-0.5 h-9 w-9 items-center justify-center rounded-full">
										<Icon as={ShieldCheck} size={18} />
									</View>
									<View className="flex-1 gap-0.5">
										<Text className="text-foreground text-base font-medium">{t("features.sync.title")}</Text>
										<Text className="text-muted-foreground text-sm leading-5">{t("features.sync.description")}</Text>
									</View>
								</View>
							</View>

							<Link href="/[locale]/sign-in" asChild>
								<Button className="h-12 w-full gap-2">
									<Text>{t("continue")}</Text>
									<Icon as={ArrowRight} size={18} />
								</Button>
							</Link>
						</CardContent>
						<CardFooter>
							<Text className="text-muted-foreground text-center text-sm leading-5">{t("footer")}</Text>
						</CardFooter>
					</Card>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

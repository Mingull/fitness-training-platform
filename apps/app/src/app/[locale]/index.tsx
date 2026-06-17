import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { ArrowRight, BarChart3, Dumbbell, Share2, Timer, Users } from "lucide-react-native";
import { View } from "react-native";
import { useTranslations } from "use-intl";

export default function OnboardingScreen() {
	const t = useTranslations("auth.onboarding");

	return (
		<View className="bg-background p-safe flex-1">
			<View className="mt-10 mb-auto h-full px-6 py-6">
				<View className="mb-8 items-center gap-1">
					<View className="bg-muted border-primary rounded-4xl border-2 p-3.5">
						<Icon as={Dumbbell} size={14 * 2.25} className="text-primary items-center justify-center" />
					</View>
					<Text className="text-muted-foreground font-mono-semibold mb-4 text-xs uppercase">{t("hero.eyebrow")}</Text>
					<Text
						textBreakStrategy="balanced"
						lineBreakStrategyIOS="push-out"
						className="font-mono-medium text-center text-2xl leading-tight font-medium tracking-tight"
					>
						{t("hero.title")}
					</Text>
					<Text textBreakStrategy="balanced" lineBreakStrategyIOS="push-out" className="text-muted-foreground text-center text-base leading-6">
						{t("hero.subtitle")}
					</Text>
				</View>
				<View className="bg-card rounded-4xl p-4 shadow-md">
					<View className="flex-row items-start gap-3 pb-2">
						<View className="bg-primary/20 mt-0.5 h-9 w-9 items-center justify-center rounded-full">
							<Icon as={Users} size={18} />
						</View>
						<View className="flex-1 gap-0.5">
							<Text className="text-foreground text-base font-medium">{t("features.findTrainer.title")}</Text>
							<Text textBreakStrategy="balanced" lineBreakStrategyIOS="push-out" className="text-muted-foreground text-sm leading-5">
								{t("features.findTrainer.description")}
							</Text>
						</View>
					</View>

					<Separator />

					<View className="flex-row items-start gap-3 py-2">
						<View className="bg-primary/20 mt-0.5 h-9 w-9 items-center justify-center rounded-full">
							<Icon as={Timer} size={18} />
						</View>
						<View className="flex-1 gap-0.5">
							<Text className="text-foreground text-base font-medium">{t("features.personalWorkouts.title")}</Text>
							<Text textBreakStrategy="balanced" lineBreakStrategyIOS="push-out" className="text-muted-foreground text-sm leading-5">
								{t("features.personalWorkouts.description")}
							</Text>
						</View>
					</View>

					<Separator />

					<View className="flex-row items-start gap-3 py-2">
						<View className="bg-primary/20 mt-0.5 h-9 w-9 items-center justify-center rounded-full">
							<Icon as={Share2} size={18} />
						</View>
						<View className="flex-1 gap-0.5">
							<Text className="text-foreground text-base font-medium">{t("features.shareProgress.title")}</Text>
							<Text textBreakStrategy="balanced" lineBreakStrategyIOS="push-out" className="text-muted-foreground text-sm leading-5">
								{t("features.shareProgress.description")}
							</Text>
						</View>
					</View>
					<Separator />

					<View className="flex-row items-start gap-3 pt-2">
						<View className="bg-primary/20 mt-0.5 h-9 w-9 items-center justify-center rounded-full">
							<Icon as={BarChart3} size={18} />
						</View>
						<View className="flex-1 gap-0.5">
							<Text className="text-foreground text-base font-medium">{t("features.track.title")}</Text>
							<Text className="text-muted-foreground text-sm leading-5">{t("features.track.description")}</Text>
						</View>
					</View>
				</View>

				<Link href="/[locale]/sign-in" asChild>
					<Button className="my-4 h-12 w-full gap-2">
						<Text>{t("actions.continue")}</Text>
						<Icon as={ArrowRight} size={18} />
					</Button>
				</Link>
				<View className="flex items-center rounded-b-4xl px-6">
					<Text textBreakStrategy="balanced" lineBreakStrategyIOS="push-out" className="text-muted-foreground text-center text-sm leading-5">
						{t("hero.footer")}
					</Text>
				</View>
			</View>
		</View>
	);
}

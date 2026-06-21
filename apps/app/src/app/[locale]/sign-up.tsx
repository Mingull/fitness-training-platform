import { DiscordIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { FieldSet } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { signUp } from "@/features/auth/sign-up/action";
import { StepFour } from "@/features/auth/sign-up/components/steps/step-four";
import { StepOne } from "@/features/auth/sign-up/components/steps/step-one";
import { StepThree } from "@/features/auth/sign-up/components/steps/step-three";
import { StepTwo } from "@/features/auth/sign-up/components/steps/step-two";
import { formSchema, stepFourSchema, stepOneSchema, stepThreeSchema, stepTwoSchema } from "@/features/auth/sign-up/schemas";
import { sharedForm } from "@/features/auth/sign-up/shared-form";
import { useAppForm } from "@/hooks/forms";
import { cn } from "@fitness/ui/lib/utils";
import { revalidateLogic } from "@tanstack/react-form";
import { Link, useRouter } from "expo-router";
import { Dumbbell } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { toast } from "sonner-native";
import { useTranslations } from "use-intl";

export default function SignupScreen() {
	const t = useTranslations("auth.signUp");
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [currentStepIndex, setCurrentStepIndex] = useState(0);

	const steps = [
		{ title: t("steps.account.title"), subtitle: t("steps.account.subtitle") },
		{ title: t("steps.personal.title"), subtitle: t("steps.personal.subtitle") },
		{ title: t("steps.trainingLevel.title"), subtitle: t("steps.trainingLevel.subtitle") },
		{ title: t("steps.about.title"), subtitle: t("steps.about.subtitle") },
	];

	const form = useAppForm({
		...sharedForm,
		validationLogic: revalidateLogic(),
		validators: {
			onDynamic: formSchema,
		},
		onSubmit: async ({ value }) => {
			setErrorMessage(null);

			const { error } = await signUp({
				email: value.stepOne.email,
				password: value.stepOne.password,
				firstname: value.stepTwo.firstname,
				lastname: value.stepTwo.lastname,
				username: value.stepTwo.username,
				experienceLevel: value.stepThree.experienceLevel || undefined,
				bio: value.stepFour.bio || undefined,
				goals: value.stepFour.goals || undefined,
				picture: value.stepFour.pictureUrl || undefined,
			});

			if (error) {
				setErrorMessage(error.message || "Failed to sign up.");
				toast.error(error.message || "Failed to sign up.", { position: "top-center" });
				return;
			}

			form.reset();
			toast.success("Signed up successfully!", { position: "top-center" });
			router.push("/[locale]/sign-in");
		},
	});

	const handleSignInProvider = async (provider: "google" | "discord") => {
		toast.error(`Social sign-in is for ${provider.slice(0, 1).toUpperCase() + provider.slice(1)} not implemented yet.`, { position: "top-center" });
	};

	return (
		<View className="p-safe flex-1">
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<ScrollView contentContainerClassName="grow px-6 py-6">
					<View className="mb-auto h-full">
						<View className="mb-8 flex-col items-center gap-1">
							<View className="bg-muted border-primary mb-6 rounded-4xl border-2 p-3.5">
								<Icon as={Dumbbell} size={14 * 2.25} className="text-primary items-center justify-center" />
							</View>
							<Text className="text-2xl font-bold">{t("hero.title", { title: "FTP" })}</Text>
							<Text
								textBreakStrategy="balanced"
								lineBreakStrategyIOS="push-out"
								className="text-muted-foreground px-2 text-center font-mono text-sm"
							>
								{t("hero.subtitle", { title: "Fitness Training Platform" })}
							</Text>
						</View>

						<View className="mb-4 gap-2">
							<View className="flex-row items-center justify-between">
								<Text className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
									{t("progress.currentStep", { current: currentStepIndex + 1, total: steps.length })}
								</Text>
								<Text className="text-muted-foreground text-xs">{steps[currentStepIndex].title}</Text>
							</View>
							<View className="flex-row gap-2">
								{steps.map((currentStep, index) => (
									<View
										key={currentStep.title}
										className={`h-1.5 flex-1 rounded-full ${index <= currentStepIndex ? "bg-primary" : "bg-muted"}`}
									/>
								))}
							</View>
							<Text className="text-muted-foreground text-sm">{steps[currentStepIndex].subtitle}</Text>
						</View>

						{errorMessage ?
							<Text className="text-destructive mb-4 text-center text-sm">{errorMessage}</Text>
						:	null}

						<FieldSet>
							{currentStepIndex === 0 && (
								<form.FormGroup name="stepOne" validators={{ onDynamic: stepOneSchema }} onGroupSubmit={() => setCurrentStepIndex(1)}>
									{(formGroup) => (
										<View className="gap-3">
											<StepOne form={form} className={cn()} />
											<Button className="flex-1" onPress={formGroup.handleSubmit} disabled={form.state.isSubmitting}>
												<Text>{t("actions.next")}</Text>
											</Button>
										</View>
									)}
								</form.FormGroup>
							)}

							{currentStepIndex === 1 && (
								<form.FormGroup name="stepTwo" validators={{ onDynamic: stepTwoSchema }} onGroupSubmit={() => setCurrentStepIndex(2)}>
									{(formGroup) => (
										<View className="gap-3">
											<StepTwo form={form} className={cn()} />
											<View className="flex-row gap-3">
												<Button variant="outline" className="flex-1" onPress={() => setCurrentStepIndex(0)}>
													<Text>{t("actions.back")}</Text>
												</Button>
												<Button className="flex-1" onPress={formGroup.handleSubmit} disabled={form.state.isSubmitting}>
													<Text>{t("actions.next")}</Text>
												</Button>
											</View>
										</View>
									)}
								</form.FormGroup>
							)}

							{currentStepIndex === 2 && (
								<form.FormGroup name="stepThree" validators={{ onDynamic: stepThreeSchema }} onGroupSubmit={() => setCurrentStepIndex(3)}>
									{(formGroup) => (
										<View className="gap-3">
											<StepThree form={form} className={cn()} />
											<View className="flex-row gap-3">
												<Button variant="outline" className="flex-1" onPress={() => setCurrentStepIndex(1)}>
													<Text>{t("actions.back")}</Text>
												</Button>
												<Button className="flex-1" onPress={formGroup.handleSubmit} disabled={form.state.isSubmitting}>
													<Text>{t("actions.next")}</Text>
												</Button>
											</View>
										</View>
									)}
								</form.FormGroup>
							)}

							{currentStepIndex === 3 && (
								<form.FormGroup name="stepFour" validators={{ onDynamic: stepFourSchema }} onGroupSubmit={() => form.handleSubmit()}>
									{(formGroup) => (
										<View className="gap-3">
											<StepFour form={form} className={cn()} />
											<View className="flex-row gap-3">
												<Button variant="outline" className="flex-1" onPress={() => setCurrentStepIndex(2)}>
													<Text>{t("actions.back")}</Text>
												</Button>
												<Button className="flex-1" onPress={formGroup.handleSubmit} disabled={form.state.isSubmitting}>
													<Text>{t("actions.submit")}</Text>
												</Button>
											</View>
										</View>
									)}
								</form.FormGroup>
							)}

							<View className="gap-1">
								<Text className="text-center text-sm">
									{t("links.haveAccount")}{" "}
									<Link href="/[locale]/sign-in" className="underline underline-offset-4" asChild>
										<Text>{t("links.signIn")}</Text>
									</Link>
								</Text>
								<View className="gap-2">
									<View className="mt-4 mb-4 flex flex-row items-center gap-1">
										<Separator className="flex-1/2" />
										<Text className="text-muted-foreground relative px-2">{t("separators.or")}</Text>
										<Separator className="flex-1/2" />
									</View>
									<View className="gap-2">
										<Button
											variant="outline"
											className="w-full"
											onPress={() => handleSignInProvider("google")}
											aria-label={t("actions.continueWithProvider", { provider: "Google" })}
										>
											<GoogleIcon className="text-foreground" />
											<Text>{t("actions.continueWithProvider", { provider: "Google" })}</Text>
										</Button>
										<Button
											variant="outline"
											className="w-full"
											onPress={() => handleSignInProvider("discord")}
											aria-label={t("actions.continueWithProvider", { provider: "Discord" })}
										>
											<DiscordIcon className="text-foreground" />
											<Text>{t("actions.continueWithProvider", { provider: "Discord" })}</Text>
										</Button>
									</View>
								</View>
							</View>
							<View className="mx-auto">
								<Text
									textBreakStrategy="balanced"
									lineBreakStrategyIOS="push-out"
									className="text-muted-foreground text-center text-xs text-balance"
								>
									{t.rich("legal.tos", {
										tos: (chunks) => (
											<Link href="/terms-of-service" className="underline">
												{chunks}
											</Link>
										),
										privacy: (chunks) => (
											<Link href="/privacy-policy" className="underline">
												{chunks}
											</Link>
										),
									})}
								</Text>
							</View>
						</FieldSet>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
}

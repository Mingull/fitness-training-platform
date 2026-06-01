import { FormBase } from "@/components/forms/base";
import { DiscordIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useAuthActions } from "@/features/auth/hooks/use-auth-actions";
import { useAppForm } from "@/hooks/forms";
import { Link } from "expo-router";
import { Dumbbell, Eye, EyeOff } from "lucide-react-native";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { toast } from "sonner-native";
import { useTranslations } from "use-intl";
import { z } from "zod";

const formSchema = z.object({
	email: z.email("Invalid email address").min(2, {
		error: "Email must be at least 2 characters long",
	}),
	password: z.string().min(8, "Password must be at least 8 characters long"),
	remember: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function SigninScreen() {
	const t = useTranslations("signIn");
	const { signIn } = useAuthActions();
	const [errorMessage, setErrorMessage] = useState<string | null>(null); // global error message state
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
	const fields = useRef(new Map<string, TextInput>());

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
			remember: false,
		} satisfies FormData as FormData,
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			setErrorMessage(null);

			const { error } = await signIn({
				email: value.email,
				password: value.password,
				remember: value.remember,
			});

			if (error) {
				setErrorMessage(error.message || "Failed to sign in.");
				toast.error(error.message || "Failed to sign in.", { position: "top-center" });
				return;
			}

			form.reset();
			toast.success("Signed in successfully!", { position: "top-center" });
		},
	});
	const handleSignInProvider = async (provider: "google" | "discord") => {
		toast.error(`Social sign-in is for ${provider.slice(0, 1).toUpperCase() + provider.slice(1)} not implemented yet.`, { position: "top-center" });
	};

	const registerRef = (name: keyof typeof formSchema.shape, input: TextInput | null) => {
		if (!input) {
			fields.current.delete(name);
			return;
		}
		fields.current.set(name, input);
	};

	const focusNext = (name: keyof typeof formSchema.shape) => {
		fields.current.get(name)?.focus();
	};

	return (
		<View className="p-safe flex-1">
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<ScrollView contentContainerClassName="h-full py-6 px-6">
					<View className="mt-18 mb-auto">
						<View className="mb-8 flex-col items-center gap-1">
							<View className="bg-muted border-primary mb-6 rounded-4xl border-2 p-3.5">
								<Icon as={Dumbbell} size={14 * 2.25} className="text-primary items-center justify-center" />
							</View>
							<Text className="text-2xl font-bold">{t("title", { title: "FTP" })}</Text>
							<Text textBreakStrategy="balanced" lineBreakStrategyIOS="push-out" className="text-muted-foreground text-center font-mono text-sm">
								{t("subtitle", { title: "FTP" })}
							</Text>
						</View>
						{/* Do i really need an error message container when i have an toast? */}
						{errorMessage ?
							<Text className="text-destructive mb-4 text-center text-sm">{errorMessage}</Text>
						:	null}
						<FieldSet>
							<FieldGroup className="gap-4">
								<form.AppField name="email" validators={{ onBlur: formSchema.shape.email }}>
									{(field) => (
										<>
											<field.Input
												label="Email"
												keyboardType="email-address"
												placeholder="Enter your email"
												labelClassName="font-mono"
												returnKeyType="next"
												ref={(input) => registerRef(field.name, input)}
												submitBehavior="submit"
												onSubmitEditing={() => focusNext("password")}
											/>
										</>
									)}
								</form.AppField>
								<form.AppField name="password" validators={{ onBlur: formSchema.shape.password }}>
									{(field) => (
										<FormBase label="Password" horizontal>
											{(isInvalid) => (
												<InputGroup>
													<InputGroupInput
														id={field.name}
														value={field.state.value}
														onBlur={field.handleBlur}
														onChangeText={field.handleChange}
														aria-invalid={isInvalid}
														secureTextEntry={!showPasswordConfirm}
														placeholder="********"
														returnKeyType="done"
														ref={(input) => registerRef(field.name, input)}
														submitBehavior="blurAndSubmit"
													/>
													<InputGroupAddon align="inline-end">
														<InputGroupButton
															onPress={() => {
																setShowPasswordConfirm((prev) => !prev);
															}}
															aria-label="Toggle password visibility"
														>
															{showPasswordConfirm ?
																<Icon as={EyeOff} />
															:	<Icon as={Eye} />}
														</InputGroupButton>
													</InputGroupAddon>
												</InputGroup>
											)}
										</FormBase>
									)}
								</form.AppField>
							</FieldGroup>
							<View className="gap-1">
								<Button className="w-full" onPress={form.handleSubmit} disabled={form.state.isSubmitting}>
									<Text>{form.state.isSubmitting ? "" : t("button")}</Text>
								</Button>
								<Text className="text-center text-sm">
									{t("noAccount")}{" "}
									<Link href="/[locale]/sign-up" className="underline underline-offset-4" asChild>
										<Text>{t("linkText")}</Text>
									</Link>
								</Text>
								<View className="gap-2">
									<View className="mt-4 mb-4 flex flex-row items-center gap-1">
										<Separator className="flex-1/2" />
										<Text className="text-muted-foreground relative px-2">{t("divider")}</Text>
										<Separator className="flex-1/2" />
									</View>
									<View className="gap-2">
										<Button
											variant="outline"
											className="w-full"
											onPress={() => handleSignInProvider("google")}
											aria-label={t("continue", { provider: "Google" })}
										>
											<GoogleIcon className="text-foreground" />
											<Text>{t("continue", { provider: "Google" })}</Text>
										</Button>
										<Button
											variant="outline"
											className="w-full"
											onPress={() => handleSignInProvider("discord")}
											aria-label={t("continue", { provider: "Discord" })}
										>
											<DiscordIcon className="text-foreground" />
											<Text>{t("continue", { provider: "Discord" })}</Text>
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
									{t.rich("tos", {
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

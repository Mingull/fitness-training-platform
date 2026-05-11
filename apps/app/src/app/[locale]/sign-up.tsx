import { FormBase } from "@/components/forms/base";
import { AdvancedInput } from "@/components/ui/advanced-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Text } from "@/components/ui/text";
import { useAppForm } from "@/hooks/forms";
import { signUp } from "@/server/auth/sign-up";
import { defineRequirements, requirementsToSchema } from "@fitness/ui/components/advanced-input";
import { Link, useRouter } from "expo-router";
import { Dumbbell, Eye, EyeOff } from "lucide-react-native";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { useTranslations } from "use-intl";
import { z } from "zod";

const passwordRequirements = defineRequirements(({ min, regex, noRepeats }) => [
	min(8, "Password must be at least 8 characters long"),
	regex(/[0-9]/, "Password must contain at least 1 numbers"),
	regex(/[a-z]/, "Password must contain at least 1 lowercase letters"),
	regex(/[A-Z]/, "Password must contain at least 1 uppercase letter"),
	regex(/[^a-zA-Z0-9]/, "Password must contain at least 1 special character"),
	noRepeats(3, "Password must not contain more than 3 repeating characters", ["hidden"]),
]);

const formSchema = z
	.object({
		firstname: z.string().min(2, { error: "First name must be at least 2 characters long" }),
		lastname: z.string().min(2, { error: "Last name must be at least 2 characters long" }),
		username: z.string().min(2, { error: "Username must be at least 2 characters long" }),
		email: z.email("Invalid email address").min(2, {
			error: "Email must be at least 2 characters long",
		}),
		password: requirementsToSchema(passwordRequirements),
		confirmPassword: z.string().min(8, { error: "Confirm password must be at least 8 characters long" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type FormData = z.infer<typeof formSchema>;

export default function Signup() {
	const t = useTranslations("sign-up");
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState<string | null>(null); // global error message state
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
	const fields = useRef(new Map<string, TextInput>());

	const form = useAppForm({
		defaultValues: {
			firstname: "",
			lastname: "",
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		} satisfies FormData as FormData,
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			setErrorMessage(null);

			const { error } = await signUp({
				firstname: value.firstname,
				lastname: value.lastname,
				username: value.username,
				email: value.email,
				password: value.password,
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
		<SafeAreaView>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<View className="mt-4 mb-4">
					<Card className="h-full">
						<ScrollView className="flex-1" contentContainerClassName="grow gap-6">
							<CardHeader>
								<View className="flex flex-col items-center gap-2">
									<Link href="/[locale]/index" className="flex flex-col items-center gap-2 font-medium">
										<Icon as={Dumbbell} size={14 * 1.5} className="flex flex-row items-center justify-center rounded-md" />
										{/* <Text screenReaderFocusable={true} className="sr-only">
										Fitness Trainer Platform
									</Text> */}
									</Link>
									<CardTitle>{t("title", { title: "FTP" })}</CardTitle>
									<CardDescription>{t("subtitle", { title: "FTP" })}</CardDescription>
								</View>
							</CardHeader>
							<CardContent>
								{errorMessage ?
									<Text className="text-center text-red-500">{errorMessage}</Text>
								:	null}
								<FieldGroup>
									<FieldSet className="gap-4">
										<form.AppField name="firstname" validators={{ onBlur: formSchema.shape.firstname }}>
											{(field) => (
												<>
													<field.Input
														label="First Name"
														keyboardType="default"
														placeholder="Enter your first name"
														returnKeyType="next"
														ref={(input) => registerRef(field.name, input)}
														submitBehavior="submit"
														onSubmitEditing={() => focusNext("lastname")}
													/>
												</>
											)}
										</form.AppField>
										<form.AppField name="lastname" validators={{ onBlur: formSchema.shape.lastname }}>
											{(field) => (
												<>
													<field.Input
														label="Last Name"
														keyboardType="default"
														placeholder="Enter your last name"
														returnKeyType="next"
														ref={(input) => registerRef(field.name, input)}
														submitBehavior="submit"
														onSubmitEditing={() => focusNext("username")}
													/>
												</>
											)}
										</form.AppField>
										<form.AppField name="username" validators={{ onBlur: formSchema.shape.username }}>
											{(field) => (
												<>
													<field.Input
														label="Username"
														keyboardType="default"
														placeholder="Enter your username"
														returnKeyType="next"
														ref={(input) => registerRef(field.name, input)}
														submitBehavior="submit"
														onSubmitEditing={() => focusNext("email")}
													/>
												</>
											)}
										</form.AppField>
										<form.AppField name="email" validators={{ onBlur: formSchema.shape.email }}>
											{(field) => (
												<>
													<field.Input
														label="Email"
														keyboardType="email-address"
														placeholder="Enter your email"
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
														<AdvancedInput
															id={field.name}
															value={field.state.value}
															onBlur={field.handleBlur}
															onChangeText={field.handleChange}
															aria-invalid={isInvalid}
															textContentType="password"
															placeholder="********"
															requirements={passwordRequirements}
															onStrengthChange={(strength) => {
																if (strength === 0) return { color: "bg-border", text: "Enter a password" };
																if (strength <= 1) return { color: "bg-red-500", text: "Very weak password" };
																if (strength <= 2) return { color: "bg-orange-500", text: "Weak password" };
																if (strength <= 3) return { color: "bg-amber-500", text: "Medium password" };
																if (strength <= 4) return { color: "bg-yellow-500", text: "Good password" };
																if (strength === 5) return { color: "bg-green-500", text: "Strong password" };
																return { color: "bg-emerald-500", text: "Strong password" };
															}}
															returnKeyType="next"
															ref={(input) => registerRef(field.name, input)}
															submitBehavior="submit"
															onSubmitEditing={() => focusNext("confirmPassword")}
														/>
													)}
												</FormBase>
											)}
										</form.AppField>
										<form.AppField name="confirmPassword" validators={{ onBlur: formSchema.shape.confirmPassword }}>
											{(field) => (
												<FormBase label="Confirm Password" horizontal>
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
									</FieldSet>
									<View className="gap-1">
										<Button className="w-full" onPress={form.handleSubmit} disabled={form.state.isSubmitting}>
											<Text>{form.state.isSubmitting ? "" : t("button")}</Text>
										</Button>
										<Text className="text-center text-sm">
											{t("have-account")}{" "}
											<Link href="/[locale]/sign-in" className="underline underline-offset-4" asChild>
												<Text>{t("linkText")}</Text>
											</Link>
										</Text>
									</View>
								</FieldGroup>
								{/* <View className="flex flex-row items-center gap-1">
										<Separator className="flex-1/2" />
										<Text className="text-muted-foreground relative px-2">{t("divider")}</Text>
										<Separator className="flex-1/2" />
									</View>
									<View className="grid gap-4 sm:grid-cols-2">
										<Button
											variant="outline"
											className="w-full"
											// onPress={() => handleSignInProvider("google")}
											aria-label={t("continue", { provider: "Google" })}
										>
											<GoogleIcon className="text-foreground" />
											<Text>{t("continue", { provider: "Google" })}</Text>
										</Button>
										<Button
											variant="outline"
											className="w-full"
											// onPress={() => handleSignInProvider("discord")}
											aria-label={t("continue", { provider: "Discord" })}
										>
											<DiscordIcon className="text-foreground" />
											<Text>{t("continue", { provider: "Discord" })}</Text>
										</Button>
									</View> */}
							</CardContent>
							<CardFooter>
								<View className="w-7/12">
									<Text className="text-muted-foreground text-center text-xs text-balance">
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
							</CardFooter>
						</ScrollView>
					</Card>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

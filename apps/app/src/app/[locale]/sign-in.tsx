import { FormBase } from "@/components/forms/base";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Text } from "@/components/ui/text";
import { useSession } from "@/context/auth";
import { useAppForm } from "@/hooks/forms";
import { Link, useRouter } from "expo-router";
import { Dumbbell, Eye, EyeOff } from "lucide-react-native";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import { useTranslations } from "use-intl";
import { z } from "zod";

const formSchema = z.object({
	email: z.string().min(2, {
		message: "Please enter your email",
	}),
	password: z.string().min(8, "Password must be at least 8 characters long"),
	remember: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function Signin() {
	const t = useTranslations("sign-in");
	const router = useRouter();
	const { signIn } = useSession();
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
								<Link href="/[locale]/index" className="flex flex-col items-center gap-2 font-medium">
									<Icon as={Dumbbell} size={14 * 1.5} className="flex flex-row items-center justify-center rounded-md" />
								</Link>
								<CardTitle>{t("title", { title: "FTP" })}</CardTitle>
								<CardDescription>{t("subtitle", { title: "FTP" })}</CardDescription>
							</CardHeader>
							<CardContent>
								{errorMessage ?
									<Text className="text-center text-red-500">{errorMessage}</Text>
								:	null}
								<FieldGroup>
									<FieldSet className="gap-4">
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
											{t("no-account")}{" "}
											<Link href="/[locale]/sign-up" className="underline underline-offset-4" asChild>
												<Text>{t("linkText")}</Text>
											</Link>
										</Text>
									</View>
								</FieldGroup>
							</CardContent>
						</ScrollView>
					</Card>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

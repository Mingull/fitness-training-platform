import { FormBase } from "@/components/forms/base";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Text } from "@/components/ui/text";
import { useAppForm } from "@/hooks/forms";
import { updateProfileContract } from "@fitness/contracts/profiles";
import { cn } from "@fitness/ui/lib/utils";
import * as Haptics from "expo-haptics";
import { XIcon } from "lucide-react-native";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { toast } from "sonner-native";
import { useTranslations } from "use-intl";
import { z } from "zod";
import { useUpdateProfile } from "../hooks/use-update-profile";

type FormData = z.infer<typeof updateProfileContract>;

export function EditProfileModal({ isOpen, onClose, defaultValues }: { isOpen: boolean; onClose: () => void; defaultValues: FormData }) {
	const t = useTranslations("profile.editModal");
	const mutator = useUpdateProfile();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const fields = useRef(new Map<string, TextInput>());

	const form = useAppForm({
		defaultValues,
		validators: {
			onSubmit: updateProfileContract,
		},
		onSubmit: async ({ value }) => {
			setErrorMessage(null);

			await mutator.mutateAsync({
				firstName: value.firstName,
				lastName: value.lastName,
				experienceLevel: value.experienceLevel,
				bio: value.bio,
				goals: value.goals,
				pictureUrl: value.pictureUrl,
			});

			if (mutator.isError) {
				const msg = mutator.error.message || t("messages.error");
				setErrorMessage(msg);
				toast.error(msg, { position: "top-center" });
				return;
			}

			form.reset();
			toast.success(t("messages.success"), { position: "top-center" });
			onClose();
		},
	});
	const options = [
		{
			value: "beginner",
			label: t("inputs.experienceLevel.options.beginner.label"),
			description: t("inputs.experienceLevel.options.beginner.description"),
		},
		{
			value: "intermediate",
			label: t("inputs.experienceLevel.options.intermediate.label"),
			description: t("inputs.experienceLevel.options.intermediate.description"),
		},
		{
			value: "advanced",
			label: t("inputs.experienceLevel.options.advanced.label"),
			description: t("inputs.experienceLevel.options.advanced.description"),
		},
		{
			value: "professional",
			label: t("inputs.experienceLevel.options.professional.label"),
			description: t("inputs.experienceLevel.options.professional.description"),
		},
	] as const;

	const registerRef = (name: keyof typeof updateProfileContract.shape, input: TextInput | null) => {
		if (!input) {
			fields.current.delete(name);
			return;
		}
		fields.current.set(name, input);
	};

	const focusNext = (name: keyof typeof updateProfileContract.shape) => {
		fields.current.get(name)?.focus();
	};

	return (
		<Modal visible={isOpen} animationType="slide" onRequestClose={onClose} transparent>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
				<View className="bg-background py-safe flex-1">
					<ScrollView className="flex-1" contentContainerClassName="px-6">
						<View className="mb-4 flex-row items-center justify-between">
							<Text className="text-foreground text-xl font-bold">{t("title")}</Text>
							<Button onPress={onClose} size="icon">
								<Icon as={XIcon} />
							</Button>
						</View>
						{errorMessage ?
							<Text className="text-destructive text-sm">{errorMessage}</Text>
						:	null}
						<FieldSet className="gap-4">
							<FieldGroup className="flex-row gap-4">
								<form.AppField name="firstName" validators={{ onBlur: updateProfileContract.shape.firstName }}>
									{(field) => (
										<field.Input
											label={t("inputs.firstName.label")}
											keyboardType="default"
											placeholder={t("inputs.firstName.placeholder")}
											labelClassName="font-mono"
											returnKeyType="next"
											ref={(input) => registerRef(field.name, input)}
											submitBehavior="submit"
											onSubmitEditing={() => focusNext("lastName")}
										/>
									)}
								</form.AppField>
								<form.AppField name="lastName" validators={{ onBlur: updateProfileContract.shape.lastName }}>
									{(field) => (
										<field.Input
											label={t("inputs.lastName.label")}
											keyboardType="default"
											placeholder={t("inputs.lastName.placeholder")}
											labelClassName="font-mono"
											returnKeyType="next"
											ref={(input) => registerRef(field.name, input)}
											submitBehavior="submit"
											onSubmitEditing={() => focusNext("bio")}
										/>
									)}
								</form.AppField>
							</FieldGroup>
							<FieldGroup className="gap-4">
								<form.AppField name="bio" validators={{ onBlur: updateProfileContract.shape.bio }}>
									{(field) => (
										<field.Textarea
											label={t("inputs.bio.label")}
											keyboardType="default"
											placeholder={t("inputs.bio.placeholder")}
											labelClassName="font-mono"
											returnKeyType="next"
											ref={(input) => registerRef(field.name, input)}
											submitBehavior="submit"
											onSubmitEditing={() => focusNext("goals")}
										/>
									)}
								</form.AppField>
								<form.AppField name="goals" validators={{ onBlur: updateProfileContract.shape.goals }}>
									{(field) => (
										<field.Input
											label={t("inputs.goals.label")}
											keyboardType="default"
											placeholder={t("inputs.goals.placeholder")}
											labelClassName="font-mono"
											returnKeyType="next"
											ref={(input) => registerRef(field.name, input)}
											submitBehavior="submit"
											onSubmitEditing={() => form.handleSubmit()}
										/>
									)}
								</form.AppField>
								<form.AppField name="experienceLevel" validators={{ onBlur: updateProfileContract.shape.experienceLevel }}>
									{(field) => {
										const handleChange = (value: string) => {
											Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
											field.handleChange(value as "beginner" | "intermediate" | "advanced" | "professional");
										};

										return (
											<FormBase label={t("inputs.experienceLevel.label")} description={t("inputs.experienceLevel.description")}>
												{() => (
													<RadioGroup onValueChange={handleChange} value={field.state.value}>
														{options.map((opt) => {
															return (
																<FieldLabel
																	key={opt.value}
																	htmlFor={`${opt.value}`}
																	onPress={() => handleChange(opt.value)}
																	checked={field.state.value === opt.value}
																	className={cn({ "border-primary bg-primary/10": field.state.value === opt.value })}
																>
																	<Field orientation="horizontal">
																		<FieldContent>
																			<FieldTitle onPress={() => handleChange(opt.value)}>{opt.label}</FieldTitle>
																			<FieldDescription onPress={() => handleChange(opt.value)}>
																				{opt.description}
																			</FieldDescription>
																		</FieldContent>
																		<RadioGroupItem
																			value={opt.value}
																			id={`${opt.value}`}
																			checked={field.state.value === opt.value}
																		/>
																	</Field>
																</FieldLabel>
															);
														})}
													</RadioGroup>
												)}
											</FormBase>
										);
									}}
								</form.AppField>
								<View className="mt-2 gap-3">
									<Button onPress={form.handleSubmit} disabled={form.state.isSubmitting}>
										<Text>{form.state.isSubmitting ? t("buttons.saving") : t("buttons.save")}</Text>
									</Button>
									<Button variant="outline" onPress={onClose}>
										<Text>{t("buttons.cancel")}</Text>
									</Button>
								</View>
							</FieldGroup>
						</FieldSet>
					</ScrollView>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
}

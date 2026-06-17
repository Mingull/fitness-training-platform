import { FormBase } from "@/components/forms/base";
import { Button } from "@/components/ui/button";
import { FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import { SelectItem } from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { useExercises } from "@/features/exercises/hooks/use-exercises";
import { withForm } from "@/hooks/forms";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { View } from "react-native";
import { useTranslations } from "use-intl";
import { addExerciseFormOpts, step1Schema } from "./shared-values";

const EXERCISE_FIELD_PREFIX = "step1.exercise.";
const FORM_FIELD_PREFIX = "form.fields.step1.";

export const Step1Form = withForm({
	...addExerciseFormOpts,
	props: {
		step: 0,
		setStep: (_step: number) => {},
		onClose: () => {},
	},
	render: function Render({ form, step, setStep, onClose }) {
		const t = useTranslations("plans.workouts.modals.addExercise");
		const { data: exercises, isLoading: isLoadingExercises, isError, error } = useExercises();

		useEffect(() => {
			if (!isLoadingExercises && (!exercises || exercises.length === 0)) {
				form.setFieldValue("step1.source", "new");
				form.setFieldValue("step1.exerciseId", undefined);
			}
		}, [isLoadingExercises, exercises, form]);

		const sourceOptions = [
			{
				value: "existing",
				label: t("form.fields.step1.source.options.existing.label"),
				description: t("form.fields.step1.source.options.existing.description"),
			},
			{
				value: "new",
				label: t("form.fields.step1.source.options.new.label"),
				description: t("form.fields.step1.source.options.new.description"),
			},
		] as const;

		const translateValidationErrors = (fieldName: string, errors: Array<{ message?: string } | undefined>) => {
			const isExerciseField = fieldName.startsWith(EXERCISE_FIELD_PREFIX);
			const normalizedField =
				isExerciseField ? fieldName.slice(EXERCISE_FIELD_PREFIX.length)
				: fieldName.startsWith("step1.") ? fieldName.slice("step1.".length)
				: fieldName;

			const validationPrefix = `${normalizedField}.validations.`;
			const translationPrefix = `${FORM_FIELD_PREFIX}${isExerciseField ? "exercise." : ""}`;
			const translate = t as unknown as (key: string) => string;

			return errors.map((error) => {
				const message = error?.message;
				if (!message || !message.startsWith(validationPrefix)) {
					return { message };
				}

				return { message: translate(`${translationPrefix}${message}`) };
			});
		};

		return (
			<form.FormGroup
				name="step1"
				validators={{
					onDynamic: step1Schema,
				}}
				onGroupSubmit={({ value: _value }) => {
					console.log("Step 1 values:", _value);
					setStep(step + 1);
				}}
			>
				{(formGroup) => (
					<FieldSet className="gap-4">
						<FieldGroup className="gap-4">
							{!isLoadingExercises && exercises!.length > 0 ?
								<form.AppField name="step1.source">
									{(field) => (
										<FormBase
											label={t("form.fields.step1.source.label")}
											description={t("form.fields.step1.source.description")}
											horizontal
										>
											{(isInvalid) => {
												const handleSourceModeChange = (value: string) => {
													Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
													field.handleChange(value as "existing" | "new");
													if (value === "existing") {
														form.setFieldValue("step1.exercise", undefined);
													} else {
														form.setFieldValue("step1.exerciseId", undefined);
													}
												};
												return (
													<View className="flex-row justify-evenly">
														{sourceOptions.map((option) => (
															<Button
																key={option.value}
																onPress={() => handleSourceModeChange(option.value)}
																variant={field.state.value === option.value ? "default" : "outline"}
																className="will-change-variable"
															>
																<Text>{option.label}</Text>
															</Button>
														))}
													</View>
												);
											}}
										</FormBase>
									)}
								</form.AppField>
							:	null}

							<form.Subscribe
								selector={(state) => [state.values.step1.source]}
								children={([source]) =>
									source === "existing" && !isLoadingExercises && exercises!.length > 0 ?
										<form.AppField name="step1.exerciseId">
											{(field) => (
												<field.Select
													label={t("form.fields.step1.exerciseId.label")}
													description={t("form.fields.step1.exerciseId.description")}
													placeholder={t("form.fields.step1.exerciseId.placeholder")}
													labelClassName="font-mono"
													portalHost="modal-portal"
													errorComponent={<FieldError errors={translateValidationErrors(field.name, field.state.meta.errors)} />}
												>
													{exercises?.map((exercise) => (
														<SelectItem key={exercise.id} label={exercise.name} value={exercise.id}>
															{exercise.name}
														</SelectItem>
													))}
												</field.Select>
											)}
										</form.AppField>
									:	<>
											<form.AppField name="step1.exercise.name">
												{(field) => (
													<field.Input
														label={t("form.fields.step1.exercise.name.label")}
														description={t("form.fields.step1.exercise.name.description")}
														placeholder={t("form.fields.step1.exercise.name.placeholder")}
														labelClassName="font-mono"
														value={field.state.value}
														onChangeText={field.handleChange}
														errorComponent={<FieldError errors={translateValidationErrors(field.name, field.state.meta.errors)} />}
													/>
												)}
											</form.AppField>
											<form.AppField name="step1.exercise.description">
												{(field) => (
													<field.Textarea
														label={t("form.fields.step1.exercise.description.label")}
														description={t("form.fields.step1.exercise.description.description")}
														placeholder={t("form.fields.step1.exercise.description.placeholder")}
														labelClassName="font-mono"
														value={field.state.value}
														onChangeText={field.handleChange}
														errorComponent={<FieldError errors={translateValidationErrors(field.name, field.state.meta.errors)} />}
													/>
												)}
											</form.AppField>
											<form.AppField name="step1.exercise.mediaUrl">
												{(field) => (
													<field.Input
														label={t("form.fields.step1.exercise.mediaUrl.label")}
														description={t("form.fields.step1.exercise.mediaUrl.description")}
														placeholder={t("form.fields.step1.exercise.mediaUrl.placeholder")}
														labelClassName="font-mono"
														value={field.state.value}
														onChangeText={field.handleChange}
														errorComponent={<FieldError errors={translateValidationErrors(field.name, field.state.meta.errors)} />}
													/>
												)}
											</form.AppField>
										</>
								}
							/>
						</FieldGroup>
						<View className="mt-3 flex-row justify-between gap-3">
							<Button className="flex-1" variant="destructive" onPress={onClose}>
								<Text>{t("actions.cancel")}</Text>
							</Button>
							<Button className="flex-1" onPress={formGroup.handleSubmit} disabled={form.state.isSubmitting}>
								<Text>{t("actions.next")}</Text>
							</Button>
						</View>
					</FieldSet>
				)}
			</form.FormGroup>
		);
	},
});

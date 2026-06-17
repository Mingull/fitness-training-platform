import { Button } from "@/components/ui/button";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { Text } from "@/components/ui/text";
import { withForm } from "@/hooks/forms";
import { useState } from "react";
import { View } from "react-native";
import { useTranslations } from "use-intl";
import { addExerciseFormOpts, step2Schema } from "./shared-values";

export const Step2Form = withForm({
	...addExerciseFormOpts,
	props: {
		step: 1,
		setStep: (_step: number) => {},
	},
	render: function Render({ form, step, setStep }) {
		const t = useTranslations("plans.workouts.modals.addExercise");
		const [weightInput, setWeightInput] = useState<string | null>(null);
		return (
			<form.FormGroup
				name="step2"
				validators={{
					onDynamic: step2Schema,
				}}
				onGroupSubmit={({ value: _value }) => {
					form.handleSubmit();
				}}
			>
				{(formGroup) => (
					<FieldSet className="gap-4">
						<FieldGroup className="gap-4">
							<form.AppField name="step2.sets">
								{(field) => (
									<field.Input
										label={t("form.fields.step2.sets.label")}
										description={t("form.fields.step2.sets.description")}
										placeholder={t("form.fields.step2.sets.placeholder")}
										labelClassName="font-mono"
										value={String(field.state.value)}
										keyboardType="numeric"
										onChangeText={(text) => {
											if (text === "") {
												field.handleChange(0);
												return;
											}
											const parsed = Number.parseInt(text, 10);
											field.handleChange(Number.isFinite(parsed) ? parsed : 0);
										}}
									/>
								)}
							</form.AppField>

							<form.AppField name="step2.reps">
								{(field) => (
									<field.Input
										label={t("form.fields.step2.reps.label")}
										description={t("form.fields.step2.reps.description")}
										placeholder={t("form.fields.step2.reps.placeholder")}
										labelClassName="font-mono"
										value={String(field.state.value)}
										keyboardType="numeric"
										onChangeText={(text) => {
											if (text === "") {
												field.handleChange(0);
												return;
											}
											const parsed = Number.parseInt(text, 10);
											field.handleChange(Number.isFinite(parsed) ? parsed : 0);
										}}
									/>
								)}
							</form.AppField>

							<form.AppField name="step2.weight">
								{(field) => (
									<field.Input
										label={t("form.fields.step2.weight.label")}
										description={t("form.fields.step2.weight.description")}
										placeholder={t("form.fields.step2.weight.placeholder")}
										labelClassName="font-mono"
										value={weightInput ?? String(field.state.value)}
										keyboardType="numbers-and-punctuation"
										onBlur={field.handleBlur}
										onChangeText={(text) => {
											if (!/^\d*\.?\d*$/.test(text)) {
												return;
											}

											setWeightInput(text);

											if (text === "" || text === ".") {
												field.handleChange(0);
												return;
											}

											if (text.endsWith(".")) {
												const parsed = Number.parseFloat(text.slice(0, -1));
												if (Number.isFinite(parsed)) {
													field.handleChange(parsed);
												}
												return;
											}

											const parsed = Number.parseFloat(text);
											if (Number.isFinite(parsed)) {
												field.handleChange(parsed);
											}
										}}
										onEndEditing={() => setWeightInput(null)}
									/>
								)}
							</form.AppField>
						</FieldGroup>
						<View className="mt-3 flex-row justify-between gap-3">
							<Button className="flex-1" onPress={() => setStep(step - 1)}>
								<Text>{t("actions.back")}</Text>
							</Button>
							<Button className="flex-1" onPress={formGroup.handleSubmit} disabled={form.state.isSubmitting}>
								<Text>{form.state.isSubmitting ? t("actions.saving") : t("actions.save")}</Text>
							</Button>
						</View>
					</FieldSet>
				)}
			</form.FormGroup>
		);
	},
});

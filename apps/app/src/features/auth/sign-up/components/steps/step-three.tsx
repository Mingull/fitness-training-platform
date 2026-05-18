import { FormBase } from "@/components/forms/base";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { withForm } from "@/hooks/forms";
import { cn } from "@fitness/ui/lib/utils";
import * as Haptics from "expo-haptics";
import { useRef } from "react";
import { TextInput } from "react-native";
import { useTranslations } from "use-intl";
import { FormSchema } from "../../schemas";
import { FlattenRefName, sharedForm } from "../../shared-form";

export const StepThree = withForm({
	...sharedForm,
	render: function Render({ form, className }) {
		const t = useTranslations("sign-up.steps.stepThree");
		const fields = useRef(new Map<FlattenRefName<FormSchema>, TextInput>());
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
		] as const;

		return (
			<FieldSet className={cn("gap-4", className)}>
				<form.AppField name="stepThree.experienceLevel">
					{(field) => {
						const handleChange = (value: string) => {
							Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
							field.handleChange(value);
						};
						return (
							<FormBase label={t("inputs.experienceLevel.label")} description={t("inputs.experienceLevel.description")}>
								{(isInvalid) => (
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
															<FieldDescription onPress={() => handleChange(opt.value)}>{opt.description}</FieldDescription>
														</FieldContent>
														<RadioGroupItem value={opt.value} id={`${opt.value}`} checked={field.state.value === opt.value} />
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
			</FieldSet>
		);
	},
});

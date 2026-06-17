import { FormBase } from "@/components/forms/base";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { withForm } from "@/hooks/forms";
import { cn } from "@fitness/ui/lib/utils";
import * as Haptics from "expo-haptics";
import { useTranslations } from "use-intl";
import { sharedForm } from "../../shared-form";

export const StepThree = withForm({
	...sharedForm,
	render: function Render({ form, className }) {
		const t = useTranslations("auth.signUp.steps.trainingLevel");
		const options = [
			{
				value: "beginner",
				label: t("form.fields.experienceLevel.options.beginner.label"),
				description: t("form.fields.experienceLevel.options.beginner.description"),
			},
			{
				value: "intermediate",
				label: t("form.fields.experienceLevel.options.intermediate.label"),
				description: t("form.fields.experienceLevel.options.intermediate.description"),
			},
			{
				value: "advanced",
				label: t("form.fields.experienceLevel.options.advanced.label"),
				description: t("form.fields.experienceLevel.options.advanced.description"),
			},
			{
				value: "professional",
				label: t("form.fields.experienceLevel.options.professional.label"),
				description: t("form.fields.experienceLevel.options.professional.description"),
			},
		] as const;

		return (
			<FieldGroup className={cn("gap-4", className)}>
				<form.AppField name="stepThree.experienceLevel">
					{(field) => {
						const handleChange = (value: string) => {
							Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
							field.handleChange(value);
						};
						return (
							<FormBase label={t("form.fields.experienceLevel.label")} description={t("form.fields.experienceLevel.description")}>
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
			</FieldGroup>
		);
	},
});

import { FieldGroup } from "@/components/ui/field";
import { withForm } from "@/hooks/forms";
import { cn } from "@fitness/ui/lib/utils";
import { useRef } from "react";
import { TextInput } from "react-native";
import { useTranslations } from "use-intl";
import { FormSchema } from "../../schemas";
import { FlattenRefName, sharedForm } from "../../shared-form";

export const StepTwo = withForm({
	...sharedForm,
	asyncAlways: true,
	render: function Render({ form, className }) {
		const t = useTranslations("auth.signUp.steps.personal");
		const fields = useRef(new Map<FlattenRefName<FormSchema>, TextInput>());

		const registerRef = (name: FlattenRefName<FormSchema>, input: TextInput | null) => {
			if (!input) {
				fields.current.delete(name);
				return;
			}

			fields.current.set(name, input);
		};

		const focusNext = (name: FlattenRefName<FormSchema>) => {
			fields.current.get(name)?.focus();
		};

		return (
			<FieldGroup className={cn("gap-4", className)}>
				<form.AppField name="stepTwo.firstname">
					{(field) => (
						<field.Input
							label={t("form.fields.firstname.label")}
							placeholder={t("form.fields.firstname.placeholder")}
							returnKeyType="next"
							ref={(input) => registerRef(field.name, input)}
							submitBehavior="submit"
							onSubmitEditing={() => focusNext("stepTwo.lastname")}
						/>
					)}
				</form.AppField>

				<form.AppField name="stepTwo.lastname">
					{(field) => (
						<field.Input
							label={t("form.fields.lastname.label")}
							placeholder={t("form.fields.lastname.placeholder")}
							returnKeyType="next"
							ref={(input) => registerRef(field.name, input)}
							submitBehavior="submit"
							onSubmitEditing={() => focusNext("stepTwo.username")}
						/>
					)}
				</form.AppField>

				<form.AppField name="stepTwo.username">
					{(field) => (
						<field.Input
							label={t("form.fields.username.label")}
							placeholder={t("form.fields.username.placeholder")}
							returnKeyType="next"
							ref={(input) => registerRef(field.name, input)}
							submitBehavior="submit"
							onSubmitEditing={() => form.handleSubmit()}
						/>
					)}
				</form.AppField>
			</FieldGroup>
		);
	},
});

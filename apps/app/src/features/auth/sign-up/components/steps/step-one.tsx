import { FormBase } from "@/components/forms/base";
import { AdvancedInput } from "@/components/ui/advanced-input";
import { FieldGroup } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { FormSchema, passwordRequirements } from "@/features/auth/sign-up/schemas";
import { withForm } from "@/hooks/forms";
import { cn } from "@fitness/ui/lib/utils";
import { Eye, EyeOff } from "lucide-react-native";
import { useRef, useState } from "react";
import { TextInput } from "react-native";
import { useTranslations } from "use-intl";
import { FlattenRefName, sharedForm } from "../../shared-form";

export const StepOne = withForm({
	...sharedForm,
	render: function Render({ form, className }) {
		const t = useTranslations("auth.signUp.steps.account");
		const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
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
				<form.AppField name="stepOne.email">
					{(field) => (
						<field.Input
							label={t("form.fields.email.label")}
							keyboardType="email-address"
							placeholder={t("form.fields.email.placeholder")}
							returnKeyType="next"
							ref={(input) => registerRef(field.name, input)}
							submitBehavior="submit"
							onSubmitEditing={() => focusNext("stepOne.password")}
						/>
					)}
				</form.AppField>

				<form.AppField name="stepOne.password">
					{(field) => (
						<FormBase label={t("form.fields.password.label")} horizontal>
							{(isInvalid) => (
								<AdvancedInput
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChangeText={field.handleChange}
									aria-invalid={isInvalid}
									textContentType="password"
											placeholder={t("form.fields.password.placeholder")}
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
									onSubmitEditing={() => focusNext("stepOne.confirmPassword")}
								/>
							)}
						</FormBase>
					)}
				</form.AppField>

				<form.AppField name="stepOne.confirmPassword">
					{(field) => (
						<FormBase label={t("form.fields.confirmPassword.label")} horizontal>
							{(isInvalid) => (
								<InputGroup>
									<InputGroupInput
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChangeText={field.handleChange}
										aria-invalid={isInvalid}
										secureTextEntry={!showPasswordConfirm}
											placeholder={t("form.fields.confirmPassword.placeholder")}
										returnKeyType="done"
										ref={(input) => registerRef(field.name, input)}
											submitBehavior="blurAndSubmit"
									/>
									<InputGroupAddon align="inline-end">
										<InputGroupButton onPress={() => setShowPasswordConfirm((prev) => !prev)} aria-label="Toggle password visibility">
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
		);
	},
});

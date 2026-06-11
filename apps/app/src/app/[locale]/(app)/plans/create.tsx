import { Button } from "@/components/ui/button";
import { FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import { Scaffold, ScaffoldBackButton, ScaffoldContent, ScaffoldDescription, ScaffoldHeader, ScaffoldTitle } from "@/components/ui/scaffold";
import { Text } from "@/components/ui/text";
import { useCreatePlan } from "@/features/plans/hooks/use-create-plan";
import { useAppForm } from "@/hooks/forms";
import { CreateTrainingPlan, createTrainingPlanContract } from "@fitness/contracts/training-plans";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";
import { toast } from "sonner-native";
import { useLocale, useTranslations } from "use-intl";

export default function TrainingPlanListScreen() {
	const t = useTranslations("trainingPrograms.create");
	const router = useRouter();
	const locale = useLocale();
	const [errorMessage, setErrorMessage] = useState<string | null>(null); // global error message state
	const fields = useRef(new Map<string, TextInput>());
	const mutator = useCreatePlan();

	const form = useAppForm({
		defaultValues: {
			name: "",
			description: "",
			difficulty: 0,
			estimatedDuration: 0,
			isPublic: false,
		} satisfies CreateTrainingPlan as CreateTrainingPlan,
		validators: {
			onSubmit: createTrainingPlanContract,
		},
		onSubmit: async ({ value }) => {
			setErrorMessage(null);

			await mutator.mutateAsync({
				name: value.name,
				description: value.description,
				difficulty: value.difficulty,
				estimatedDuration: value.estimatedDuration,
				isPublic: value.isPublic,
			});

			if (mutator.isError) {
				setErrorMessage(mutator.error.message || t("toasts.error"));
				toast.error(mutator.error.message || t("toasts.error"), { position: "top-center" });
				return;
			}

			form.reset();
			toast.success(t("toasts.success"), { position: "top-center" });
			router.push({ pathname: "/[locale]/(app)/plans", params: { locale } });
		},
	});

	const registerRef = (name: keyof typeof createTrainingPlanContract.shape, input: TextInput | null) => {
		if (!input) {
			fields.current.delete(name);
			return;
		}
		fields.current.set(name, input);
	};

	const focusNext = (name: keyof typeof createTrainingPlanContract.shape) => {
		fields.current.get(name)?.focus();
	};

	const translateValidationErrors = (fieldName: keyof typeof createTrainingPlanContract.shape, errors: ({ message?: string } | undefined)[]) => {
		return errors.map((error) => ({
			message:
				error?.message && error.message.startsWith(`${fieldName}.validations.`) ?
					(t as unknown as (key: string) => string)(`fields.${error.message}`)
				:	error?.message,
		}));
	};

	const calculateDifficulty = useCallback((level: number) => {
		if (level <= 20) return "beginner";
		if (level <= 40) return "novice";
		if (level <= 60) return "intermediate";
		if (level <= 80) return "advanced";
		return "expert";
	}, []);

	return (
		<Scaffold>
			<ScaffoldHeader>
				<View className="items-start justify-between">
					<ScaffoldBackButton />
					<ScaffoldTitle className="text-foreground text-xl font-semibold tracking-tight">{t("title")}</ScaffoldTitle>
					<ScaffoldDescription className="text-muted-foreground text-sm">{t("description")}</ScaffoldDescription>
				</View>
			</ScaffoldHeader>
			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<ScaffoldContent scrollable>
					{errorMessage ?
						<Text className="text-destructive text-sm">{errorMessage}</Text>
					:	null}
					<FieldSet>
						<FieldGroup className="gap-4">
							<form.AppField name="name" validators={{ onBlur: createTrainingPlanContract.shape.name }}>
								{(field) => (
									<>
										<field.Input
											label={t("fields.name.label")}
											description={t("fields.name.description")}
											keyboardType="default"
											placeholder={t("fields.name.placeholder")}
											labelClassName="font-mono"
											returnKeyType="next"
											ref={(input) => registerRef(field.name, input)}
											submitBehavior="submit"
											onSubmitEditing={() => focusNext("description")}
											errorComponent={<FieldError errors={translateValidationErrors(field.name, field.state.meta.errors)} />}
										/>
									</>
								)}
							</form.AppField>
							<form.AppField name="description" validators={{ onBlur: createTrainingPlanContract.shape.description }}>
								{(field) => (
									<>
										<field.Textarea
											label={t("fields.description.label")}
											description={t("fields.description.description")}
											keyboardType="default"
											placeholder={t("fields.description.placeholder")}
											labelClassName="font-mono"
											returnKeyType="next"
											ref={(input) => registerRef(field.name, input)}
											submitBehavior="submit"
											onSubmitEditing={() => focusNext("estimatedDuration")}
											errorComponent={<FieldError errors={translateValidationErrors(field.name, field.state.meta.errors)} />}
										/>
									</>
								)}
							</form.AppField>
							<form.AppField name="difficulty" validators={{ onBlur: createTrainingPlanContract.shape.difficulty }}>
								{(field) => (
									<>
										<field.Slider
											label={t("fields.difficulty.label")}
											description={t("fields.difficulty.description")}
											labelClassName="font-mono"
											value={[field.state.value]}
											onValueChange={(e) => field.handleChange(e[0])}
											min={0}
											max={100}
											step={1}
											errorComponent={<FieldError errors={translateValidationErrors(field.name, field.state.meta.errors)} />}
										/>
										<Text className="text-muted-foreground text-sm">
											{t("fields.difficulty.selected", {
												label: calculateDifficulty(field.state.value),
												level: field.state.value,
											})}
										</Text>
									</>
								)}
							</form.AppField>
							<form.AppField name="estimatedDuration" validators={{ onBlur: createTrainingPlanContract.shape.estimatedDuration }}>
								{(field) => (
									<>
										<field.Input
											label={t("fields.estimatedDuration.label")}
											description={t("fields.estimatedDuration.description")}
											value={String(field.state.value)}
											keyboardType="numeric"
											placeholder={t("fields.estimatedDuration.placeholder")}
											labelClassName="font-mono"
											returnKeyType="next"
											ref={(input) => registerRef(field.name, input)}
											submitBehavior="submit"
											onChangeText={(text) => {
												if (text === "") {
													field.handleChange(0);
													return;
												}
												const parsed = Number.parseInt(text, 10);
												field.handleChange(Number.isFinite(parsed) ? parsed : 0);
											}}
											onSubmitEditing={() => focusNext("isPublic")}
											errorComponent={<FieldError errors={translateValidationErrors(field.name, field.state.meta.errors)} />}
										/>
									</>
								)}
							</form.AppField>
							<form.AppField name="isPublic" validators={{ onBlur: createTrainingPlanContract.shape.isPublic }}>
								{(field) => (
									<>
										<field.Switch
											label={t("fields.isPublic.label")}
											description={t("fields.isPublic.description")}
											labelClassName="font-mono"
										/>
										<FieldError errors={translateValidationErrors(field.name, field.state.meta.errors)} />
									</>
								)}
							</form.AppField>
						</FieldGroup>
						<Button className="w-full" onPress={form.handleSubmit} disabled={form.state.isSubmitting}>
							<Text>{form.state.isSubmitting ? "Creating Plan..." : "Create Plan"}</Text>
						</Button>
					</FieldSet>
				</ScaffoldContent>
			</KeyboardAvoidingView>
		</Scaffold>
	);
}

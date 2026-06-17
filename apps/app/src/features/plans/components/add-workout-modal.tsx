import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useAddWorkout } from "@/features/plans/hooks/use-add-workout";
import { useAppForm } from "@/hooks/forms";
import { addWorkoutToPlanContract } from "@fitness/contracts/training-plans";
import { cn } from "@fitness/ui/lib/utils";
import { BlurView } from "expo-blur";
import { XIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Keyboard, Modal, Platform, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { toast } from "sonner-native";
import { useTranslations } from "use-intl";

export function AddWorkoutModal({
	isOpen,
	onClose,
	targetRef,
	planId,
}: {
	isOpen: boolean;
	onClose: () => void;
	targetRef: React.RefObject<View | null>;
	planId: string;
}) {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const t = useTranslations("plans.item.modals.addWorkout");
	const mutator = useAddWorkout(planId);
	const cardTranslateY = useSharedValue(0);
	const animatedCardStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: cardTranslateY.value }],
	}));

	useEffect(() => {
		// Animate the card vertically so the modal stays centered at rest,
		// then lifts above the keyboard while typing.
		const animateCard = (toValue: number, duration: number) => {
			cardTranslateY.value = withTiming(toValue, {
				duration,
				easing: Easing.out(Easing.cubic),
			});
		};

		// iOS "will" events let the animation sync with keyboard motion;
		// Android only provides reliable "did" timing for this scenario.
		const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
		const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

		const show = Keyboard.addListener(showEvent, (event) => {
			const keyboardHeight = event.endCoordinates.height;
			// Convert keyboard height to a practical upward offset and clamp it
			// so small/large keyboards still feel natural.
			const lift = Math.min(Math.max(keyboardHeight * 0.35, 70), 180);
			animateCard(-lift, event.duration ?? 250);
		});

		const hide = Keyboard.addListener(hideEvent, (event) => {
			// Return the card to its centered position when keyboard closes.
			animateCard(0, event.duration ?? 220);
		});

		// Clean up listeners when the component unmounts.
		return () => {
			show.remove();
			hide.remove();
		};
	}, [cardTranslateY]);

	const form = useAppForm({
		defaultValues: {
			name: "",
		},
		validators: {
			onSubmit: addWorkoutToPlanContract,
		},
		onSubmit: async ({ value }) => {
			setErrorMessage(null);

			await mutator.mutateAsync({
				name: value.name,
			});

			if (mutator.isError) {
				setErrorMessage(mutator.error.message || t("feedback.error"));
				toast.error(mutator.error.message || t("feedback.error"), { position: "top-center" });
				return;
			}

			form.reset();
			toast.success(t("feedback.success"), { position: "top-center" });
			onClose();
		},
	});
	const translateValidationErrors = (fieldName: keyof typeof addWorkoutToPlanContract.shape, errors: ({ message?: string } | undefined)[]) => {
		return errors.map((error) => ({
			message:
				error?.message && error.message.startsWith(`${fieldName}.validations.`) ?
					(t as unknown as (key: string) => string)(`form.fields.${error.message}`)
				:	error?.message,
		}));
	};

	return (
		<Modal visible={isOpen} animationType="fade" onRequestClose={onClose} transparent statusBarTranslucent presentationStyle="overFullScreen">
			<View className="flex-1">
				<BlurView className="flex-1 justify-center px-4" blurTarget={targetRef} blurMethod="dimezisBlurViewSdk31Plus" intensity={35}>
					<Animated.View className={cn("flex-1 justify-center")} style={animatedCardStyle}>
						<Card>
							<CardHeader className="items-start gap-1.5">
								<CardTitle className="text-xl font-semibold tracking-tight">{t("header.title")}</CardTitle>
								<CardDescription className="text-sm leading-5">{t("header.description")}</CardDescription>
							</CardHeader>
							<CardAction className="absolute top-3 right-3">
								<Button variant="ghost" className="rounded-full" onPress={onClose}>
									<Icon as={XIcon} size={18} className="text-muted-foreground" />
								</Button>
							</CardAction>
							<CardContent className="gap-2 pt-1">
								<FieldSet className="gap-4">
									<FieldGroup className="flex-row gap-4">
										<form.AppField name="name" validators={{ onBlur: addWorkoutToPlanContract.shape.name }}>
											{(field) => (
												<field.Input
													label={t("form.fields.name.label")}
													keyboardType="default"
													placeholder={t("form.fields.name.placeholder")}
													labelClassName="font-mono"
													returnKeyType="go"
													submitBehavior="submit"
													errorComponent={<FieldError errors={translateValidationErrors(field.name, field.state.meta.errors)} />}
												/>
											)}
										</form.AppField>
									</FieldGroup>
									<View className="mt-3 flex-row justify-between gap-3">
										<Button className="flex-1" onPress={form.handleSubmit} disabled={form.state.isSubmitting}>
											<Text>{form.state.isSubmitting ? t("actions.saving") : t("actions.save")}</Text>
										</Button>
										<Button className="flex-1" variant="destructive" onPress={onClose}>
											<Text>{t("actions.cancel")}</Text>
										</Button>
									</View>
								</FieldSet>
							</CardContent>
						</Card>
					</Animated.View>
				</BlurView>
			</View>
		</Modal>
	);
}

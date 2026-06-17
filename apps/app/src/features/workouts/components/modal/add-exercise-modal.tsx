import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useAppForm } from "@/hooks/forms";
import { AddExerciseToWorkout, addExerciseToWorkoutContract } from "@fitness/contracts/workouts";
import { cn } from "@fitness/ui/lib/utils";
import { PortalHost } from "@rn-primitives/portal";
import { revalidateLogic } from "@tanstack/react-form";
import { BlurView } from "expo-blur";
import { XIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Keyboard, Modal, Platform, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { toast } from "sonner-native";
import { useTranslations } from "use-intl";
import { z } from "zod";
import { useAddExercise } from "../../hooks/use-add-exercise";
import { addExerciseFormOpts, step1Schema, step2Schema } from "./shared-values";
import { Step1Form } from "./step1";
import { Step2Form } from "./step2";

export function AddExerciseModal({
	isOpen,
	onClose,
	targetRef,
	workoutId,
}: {
	isOpen: boolean;
	onClose: () => void;
	targetRef: React.RefObject<View | null>;
	workoutId: string;
}) {
	const [step, setStep] = useState(0);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const t = useTranslations("plans.workouts.modals.addExercise");
	const mutator = useAddExercise(workoutId);
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
		...addExerciseFormOpts,
		validationLogic: revalidateLogic(),
		validators: {
			// onDynamic is only used when `form.handleSubmit` is called itself.
			// When `form.FormGroup`'s `handleSubmit` is called, it will only validate the current step's schema.
			// This means that this schema will not be called when the user submits the form group, but instead when they submit the entire form.
			onDynamic: z.object({
				step1: step1Schema,
				step2: step2Schema,
			}),
		},
		onSubmit: async ({ value }) => {
			setErrorMessage(null);

			const payload: AddExerciseToWorkout = {
				exerciseId: value.step1.source === "existing" ? value.step1.exerciseId || undefined : undefined,
				exercise: value.step1.source === "new" ? value.step1.exercise : undefined,
				reps: value.step2.reps,
				sets: value.step2.sets,
				weight: value.step2.weight,
			};

			const parsedPayload = addExerciseToWorkoutContract.safeParse(payload);
			if (!parsedPayload.success) {
				const issue = parsedPayload.error.issues[0];
				const translatedMessage =
					typeof issue?.message === "string" && issue.message.includes(".validations.") ?
						(t as unknown as (key: string) => string)(`form.fields.${issue.message}`)
						: t("feedback.error");

				setErrorMessage(translatedMessage);
				toast.error(translatedMessage, { position: "top-center" });
				return;
			}

			await mutator.mutateAsync(parsedPayload.data);

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

	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<Modal visible={isOpen} animationType="fade" onRequestClose={handleClose} transparent statusBarTranslucent>
			<View className="flex-1">
				<BlurView className="flex-1 justify-center px-4" blurTarget={targetRef} blurMethod="dimezisBlurViewSdk31Plus" intensity={35}>
					<Animated.View className={cn("flex-1 justify-center")} style={animatedCardStyle}>
						<Card>
							<CardHeader className="items-start gap-1.5">
								<CardTitle className="text-xl font-semibold tracking-tight">{t("header.title")}</CardTitle>
								<CardDescription className="text-sm leading-5">{t("header.description")}</CardDescription>
							</CardHeader>
							<CardAction className="absolute top-3 right-3">
								<Button variant="ghost" className="rounded-full" onPress={handleClose}>
									<Icon as={XIcon} size={18} className="text-muted-foreground" />
								</Button>
							</CardAction>
							<CardContent className="gap-2 pt-1">
								{errorMessage ?
									<Text className="text-destructive text-sm">{errorMessage}</Text>
									: null}
								{step === 0 && <Step1Form form={form} step={step} setStep={setStep} onClose={handleClose} />}
								{step === 1 && <Step2Form form={form} step={step} setStep={setStep} />}
							</CardContent>
						</Card>
					</Animated.View>
				</BlurView>
			</View>
			<PortalHost name="modal-portal" />
		</Modal>
	);
}

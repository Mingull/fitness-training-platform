// This is a concept implementation and not fully polished and working yet
// Now we just handle the multi step manually in the screen it self

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { TextInput } from "react-native";
import { z } from "zod";
import { useAppForm, useFormContext, withForm } from "./forms";

type StepDefinition<Name extends string, Schema extends z.ZodType> = {
	name: Name;
	render: (context: {
		form: UseAppFormSchema<z.infer<Schema>>;
		registerRef: (name: string, input: TextInput | null) => void;
		focusNext: (name: string) => void;
	}) => ReactNode;
	defaultValues: z.input<Schema>;
	validationSchema: Schema;
};

type CollectedStepValues<TSteps extends readonly StepDefinition<string, z.ZodType>[]> = {
	[K in TSteps[number] as K["name"]]: z.input<K["validationSchema"]>;
};

export function useMultiStepForm<const TSteps extends readonly StepDefinition<string, z.ZodType>[]>({
	steps,
	onSubmit,
}: {
	steps: TSteps;
	onSubmit: ({ value }: { value: CollectedStepValues<TSteps> }) => Promise<void>;
}) {
	if (steps.length === 0) {
		throw new Error("useMultiStepForm requires at least one step.");
	}

	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const valuesRef = useRef<Partial<CollectedStepValues<TSteps>>>({});
	const currentStep = steps[currentStepIndex];
	const childFormRef = useRef<any | null>(null);

	const defaultValues = useMemo(
		() =>
			steps.reduce((accumulator, step) => {
				(accumulator as any)[step.name] = step.defaultValues;
				return accumulator;
			}, {} as CollectedStepValues<TSteps>),
		[steps],
	);

	// Create wrapped child forms using withForm so each step gets its own typed form context
	const StepWrappers = useMemo(() => {
		return steps.map((step, idx) => {
			const StepInner = ({ onMount }: { onMount: (formApi: any) => void }) => {
				const formApi = useFormContext();
				useEffect(() => {
					onMount(formApi);
				}, [formApi, onMount]);
				return step.render({ form: formApi as any, registerRef, focusNext });
			};

			const childOnSubmit = async ({ value }: { value: any }) => {
				valuesRef.current = {
					...valuesRef.current,
					[step.name]: value,
				} as Partial<CollectedStepValues<TSteps>>;

				if (idx < steps.length - 1) {
					setCurrentStepIndex((i) => Math.min(i + 1, steps.length - 1));
					return;
				}

				await onSubmit({ value: valuesRef.current as unknown as CollectedStepValues<TSteps> });
			};

			const Wrapped = (withForm as any)({
				defaultValues: step.defaultValues,
				validators: { onSubmit: step.validationSchema as any },
				onSubmit: childOnSubmit,
			})(StepInner as any);

			return Wrapped;
		});
	}, [steps, onSubmit, registerRef, focusNext]);

	const next = () => {
		setCurrentStepIndex((index) => {
			if (index >= steps.length - 1) return index;
			return index + 1;
		});
	};

	const back = () => {
		setCurrentStepIndex((index) => {
			if (index <= 0) return index;
			return index - 1;
		});
	};

	const goTo = (index: number) => {
		setCurrentStepIndex(Math.max(0, Math.min(index, steps.length - 1)));
	};

	const reset = () => {
		valuesRef.current = {};
		setCurrentStepIndex(0);
		if (childFormRef.current?.reset) childFormRef.current.reset();
	};
	const currentStepWrapped = StepWrappers[currentStepIndex];

	const submitCurrent = () => {
		if (!childFormRef.current) return;
		if (childFormRef.current.handleSubmit) childFormRef.current.handleSubmit();
	};

	const CurrentStepElement = () => {
		const Wrapped = currentStepWrapped as any;
		return <Wrapped onMount={(f: any) => (childFormRef.current = f)} />;
	};

	return {
		registerRef,
		focusNext,
		steps,
		currentStepIndex,
		currentStep: CurrentStepElement,
		isFirstStep: currentStepIndex === 0,
		isLastStep: currentStepIndex === steps.length - 1,
		next,
		back,
		goTo,
		reset,
		submitCurrent,
	};
}

export const withStep = <TSchema extends z.ZodType>(
	schema: TSchema,
	renderer: (opts: {
		registerRef: (name: FlattenRefName<z.infer<TSchema>>, input: TextInput | null) => void;
		focusNext: (name: FlattenRefName<z.infer<TSchema>>) => void;
		form: UseAppFormSchema<z.input<TSchema>>;
	}) => ReactNode,
) => {
	return renderer;
};

export type UseAppForm = ReturnType<typeof useAppForm>;

export type UseAppFormSchema<TSchema> = ReturnType<
	typeof useAppForm<TSchema, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, unknown>
>;

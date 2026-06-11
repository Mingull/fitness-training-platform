"use client";

import { cva, type VariantProps } from "class-variance-authority";
import React, { useMemo } from "react";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@fitness/ui/lib/utils";
import { Text as RNText, View, ViewProps } from "react-native";
import { Text, TextClassContext } from "./text";
type SlotElementType = React.ElementType & { slot?: string };
type SlotReactElement = React.ReactElement<{ children?: React.ReactNode; [key: string]: unknown }>;

function hasChildWithSlot(children: React.ReactNode, slot: string): boolean {
	function walk(node: React.ReactNode): boolean {
		if (node == null || typeof node === "boolean") {
			return false;
		}

		if (!React.isValidElement(node)) {
			return false;
		}

		const element = node as SlotReactElement;

		if (element.props["data-slot"] === slot) {
			return true;
		}

		const elementType = element.type as SlotElementType;
		if (elementType.slot === slot) {
			return true;
		}

		return React.Children.toArray(element.props.children).some(walk);
	}

	return React.Children.toArray(children).some(walk);
}

function FieldSet({ className, children, ...props }: ViewProps) {
	const hasCheckboxGroup = hasChildWithSlot(children, "checkbox-group");
	const hasRadioGroup = hasChildWithSlot(children, "radio-group");

	return (
		<TextClassContext.Provider value="text-foreground">
			<View data-slot="field-set" className={cn("flex flex-col gap-6", { "gap-3": hasCheckboxGroup || hasRadioGroup }, className)} {...props}>
				{children}
			</View>
		</TextClassContext.Provider>
	);
}

FieldSet.slot = "field-set";

function FieldLegend({ className, variant, ...props }: Omit<React.ComponentProps<typeof RNText>, "variant"> & { variant?: "label" | "legend" }) {
	return (
		<Text
			data-slot="field-legend"
			data-variant={variant}
			className={cn("mb-3 font-medium", className)}
			variant={variant === "label" ? "small" : "default"}
			{...props}
		/>
	);
}

FieldLegend.slot = "field-legend";

function FieldGroup({ className, ...props }: ViewProps) {
	return <View data-slot="field-group" className={cn("group/field-group @container/field-group flex w-full flex-col gap-7", className)} {...props} />;
}

FieldGroup.slot = "field-group";

const fieldVariants = cva("group/field flex w-full gap-3", {
	variants: {
		orientation: {
			vertical: "flex-col *:w-full",
			horizontal: "flex-row items-center",
			responsive: "flex-col",
		},
	},
	defaultVariants: {
		orientation: "vertical",
	},
});

function Field({ className, children, orientation = "vertical", ...props }: ViewProps & VariantProps<typeof fieldVariants>) {
	const hasFieldContent = hasChildWithSlot(children, "field-content");
	const hasFieldLabel = hasChildWithSlot(children, "field-label");

	return (
		<View
			role="group"
			data-slot="field"
			data-orientation={orientation}
			className={cn(
				fieldVariants({ orientation }),
				{
					"items-start": orientation === "horizontal" && hasFieldContent,
					"flex-auto": orientation === "horizontal" && hasFieldLabel,
				},
				className,
			)}
			{...props}
		>
			{children}
		</View>
	);
}

Field.slot = "field";

function FieldContent({ className, ...props }: ViewProps) {
	return <View data-slot="field-content" className={cn("group/field-content flex flex-1 flex-col gap-1 leading-snug", className)} {...props} />;
}

FieldContent.slot = "field-content";

function FieldLabel({
	className,
	children,
	...props
}: React.ComponentProps<typeof Label> & {
	checked?: boolean;
}) {
	const hasField = hasChildWithSlot(children, "field");
	return (
		<Label
			data-slot="field-label"
			className={cn(
				// base (kept)
				"group/field-label peer/field-label flex w-fit gap-2 leading-snug",
				{
					"border-border w-full flex-col rounded-2xl border p-4": hasField,
					"opacity-50": props.disabled,
				},
				className,
			)}
			{...props}
		>
			{children}
		</Label>
	);
}

FieldLabel.slot = "field-label";

function FieldTitle({ className, disabled, ...props }: React.ComponentProps<typeof Text> & { disabled?: boolean }) {
	return (
		<Text data-slot="field-label" className={cn("flex w-fit items-center gap-2 text-sm font-medium", { "opacity-50": disabled }, className)} {...props} />
	);
}

FieldTitle.slot = "field-label";

function FieldDescription({ className, ...props }: React.ComponentProps<typeof Text>) {
	return (
		<Text
			data-slot="field-description"
			className={cn(
				// ❌ removed group-has + complex sibling selectors
				"text-muted-foreground text-left text-sm leading-normal font-normal",
				className,
			)}
			{...props}
		/>
	);
}

FieldDescription.slot = "field-description";

function FieldSeparator({ children, className, ...props }: ViewProps & { children?: React.ReactNode }) {
	return (
		<View data-slot="field-separator" data-content={!!children} className={cn("relative -my-2 h-5 text-sm", className)} {...props}>
			<Separator className="absolute inset-0 top-1/2" />
			{children && (
				<Text className="bg-background text-muted-foreground relative mx-auto block w-fit px-2" data-slot="field-separator-content">
					{children}
				</Text>
			)}
		</View>
	);
}

FieldSeparator.slot = "field-separator";

function FieldError({ className, children, errors, ...props }: ViewProps & { errors?: ({ message?: string } | undefined)[] }) {
	const content = useMemo(() => {
		if (children) {
			return children;
		}

		if (!errors?.length) {
			return null;
		}

		const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()];

		if (uniqueErrors?.length === 1) {
			return <Text className="text-destructive text-sm font-normal">{uniqueErrors[0]?.message}</Text>;
		}

		return (
			<View className="ml-4 flex flex-col gap-1">
				{uniqueErrors.map(
					(error, index) =>
						error?.message && (
							<Text key={index} className="text-destructive text-sm font-normal">
								{"\u2022 "}
								{error.message}
							</Text>
						),
				)}
			</View>
		);
	}, [children, errors]);

	if (!content) {
		return null;
	}

	return (
		<View role="alert" data-slot="field-error" className={cn(className)} {...props}>
			{content}
		</View>
	);
}

FieldError.slot = "field-error";

export { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle };

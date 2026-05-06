"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Platform, View, ViewProps } from "react-native";

import { cn } from "@fitness/ui/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Text } from "./text";
import { Textarea } from "./textarea";

function InputGroup({ className, ...props }: ViewProps & { className?: string }) {
	return (
		<View
			data-slot="input-group"
			role="group"
			className={cn(
				"group/input-group bg-input/50 dark:bg-input has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-destructive/20 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 relative flex h-9 w-full min-w-0 flex-row items-center rounded-4xl border border-transparent transition-[color,box-shadow,background-color] outline-none has-data-[align=block-end]:rounded-3xl has-data-[align=block-start]:rounded-3xl has-[[data-slot][aria-invalid=true]]:ring-3 has-[textarea]:rounded-2xl has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5",
				Platform.select({
					web: "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/30 in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-[[data-slot=input-group-control]:focus-visible]:ring-3",
				}),
				className,
			)}
			{...props}
		/>
	);
}

const inputGroupAddonVariants = cva(
	"flex h-full cursor-text items-center justify-center  gap-2 py-2 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 **:data-[slot=kbd]:rounded-3xl **:data-[slot=kbd]:bg-muted-foreground/10 **:data-[slot=kbd]:px-1.5 [&>svg:not([class*='size-'])]:size-4",
	{
		variants: {
			align: {
				"inline-start": "order-first pl-3 has-[>button]:-ml-1 has-[>kbd]:-ml-1",
				"inline-end": "order-last pr-3 has-[>button]:-mr-1 has-[>kbd]:-mr-1",
				"block-start": "order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-3.5 [.border-b]:pb-3.5",
				"block-end": "order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-3.5 [.border-t]:pt-3.5",
			},
		},
		defaultVariants: {
			align: "inline-start",
		},
	},
);

function InputGroupAddon({ className, align = "inline-start", ...props }: ViewProps & VariantProps<typeof inputGroupAddonVariants>) {
	return <View data-slot={`input-group-addon-${align}`} role="group" className={cn(inputGroupAddonVariants({ align }), className)} {...props} />;
}

const inputGroupButtonVariants = cva("flex items-center gap-2 rounded-4xl text-sm shadow-none", {
	variants: {
		size: {
			xs: "h-6 gap-1 rounded-xl px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
			sm: "",
			"icon-xs": "size-6 rounded-xl p-0 has-[>svg]:p-0",
			"icon-sm": "size-8 p-0 has-[>svg]:p-0",
		},
	},
	defaultVariants: {
		size: "xs",
	},
});

function InputGroupButton({
	className,
	variant = "ghost",
	size = "xs",
	...props
}: Omit<React.ComponentProps<typeof Button>, "size"> & VariantProps<typeof inputGroupButtonVariants>) {
	return <Button data-size={size} variant={variant} className={cn(inputGroupButtonVariants({ size }), className)} {...props} />;
}

function InputGroupText({ className, ...props }: React.ComponentProps<typeof Text>) {
	return (
		<Text
			className={cn(
				"text-muted-foreground flex items-center gap-2 text-sm",
				Platform.select({ web: "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4" }),
				className,
			)}
			{...props}
		/>
	);
}

function InputGroupInput({ className, ...props }: React.ComponentProps<typeof Input>) {
	return (
		<Input
			data-slot="input-group-control"
			className={cn(
				"flex-1 rounded-r-none border-0 bg-transparent shadow-none dark:bg-transparent",
				Platform.select({ web: "ring-0 focus-visible:ring-0 aria-invalid:ring-0" }),
				className,
			)}
			{...props}
		/>
	);
}

function InputGroupTextarea({ className, ...props }: React.ComponentProps<typeof Textarea>) {
	return (
		<Textarea
			data-slot="input-group-control"
			className={cn(
				"flex-1 resize-none rounded-r-none border-0 bg-transparent py-2.5 shadow-none dark:bg-transparent",
				Platform.select({ web: "ring-0 focus-visible:ring-0 aria-invalid:ring-0" }),
				className,
			)}
			{...props}
		/>
	);
}

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea };

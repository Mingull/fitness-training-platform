import { Icon } from "@/components/ui/icon";
import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@fitness/ui/lib/utils";
import * as SelectPrimitive from "@rn-primitives/select";
import { Check, ChevronDown, ChevronDownIcon, ChevronUpIcon } from "lucide-react-native";
import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { FadeIn, FadeOut } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

type Option = SelectPrimitive.Option;

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

function SelectValue({ ref, className, ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
	const { value } = SelectPrimitive.useRootContext();
	return (
		<SelectPrimitive.Value
			ref={ref}
			className={cn("text-foreground line-clamp-1 flex flex-row items-center gap-2 text-sm", !value && "text-muted-foreground", className)}
			{...props}
		/>
	);
}

function SelectTrigger({
	ref,
	className,
	children,
	size = "default",
	...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
	children?: React.ReactNode;
	size?: "default" | "sm";
}) {
	return (
		<SelectPrimitive.Trigger
			ref={ref}
			className={cn(
				"bg-input aria-invalid:border-destructive flex w-fit flex-row items-center justify-between gap-1.5 rounded-3xl border border-transparent px-3 py-2 text-sm transition-[color,box-shadow,background-color]",
				Platform.select({
					web: "aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 focus-visible:border-ring focus-visible:ring-ring/30 whitespace-nowrap outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				}),
				className,
			)}
			{...props}
		>
			{children}
			<Icon as={ChevronDown} aria-hidden={true} className="text-muted-foreground size-4" />
		</SelectPrimitive.Trigger>
	);
}

const FullWindowOverlay = Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment;

function SelectContent({
	className,
	children,
	position = "item-aligned",
	portalHost,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
	className?: string;
	portalHost?: string;
}) {
	return (
		<SelectPrimitive.Portal hostName={portalHost}>
			<FullWindowOverlay>
				<SelectPrimitive.Overlay style={Platform.select({ native: StyleSheet.absoluteFill })}>
					<TextClassContext.Provider value="text-popover-foreground">
						<NativeOnlyAnimatedView className="z-50" entering={FadeIn} exiting={FadeOut}>
							<SelectPrimitive.Content
								className={cn(
									"dark bg-popover text-popover-foreground relative z-50 max-h-(--radix-select-content-available-height) min-w-36 overflow-x-hidden overflow-y-auto rounded-3xl shadow-lg",
									Platform.select({
										web: cn(
											"ring-foreground/5 dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 max-h-52 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto ring-1 duration-100 data-[align-trigger=true]:animate-none",
											props.side === "bottom" && "slide-in-from-top-2",
											props.side === "top" && "slide-in-from-bottom-2",
										),
									}),
									position === "popper" &&
										Platform.select({
											web: cn(props.side === "bottom" && "translate-y-1", props.side === "top" && "-translate-y-1"),
										}),
									className,
								)}
								position={position}
								{...props}
							>
								<SelectScrollUpButton />
								<SelectPrimitive.Viewport
									className={cn(
										"p-1",
										position === "popper" &&
											cn(
												"w-full",
												Platform.select({
													web: "h-(--radix-select-trigger-height) min-w-(--radix-select-trigger-width)",
												}),
											),
									)}
								>
									{children}
								</SelectPrimitive.Viewport>
								<SelectScrollDownButton />
							</SelectPrimitive.Content>
						</NativeOnlyAnimatedView>
					</TextClassContext.Provider>
				</SelectPrimitive.Overlay>
			</FullWindowOverlay>
		</SelectPrimitive.Portal>
	);
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
	return <SelectPrimitive.Label className={cn("text-muted-foreground px-3 py-2.5 text-xs", className)} {...props} />;
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
	return (
		<SelectPrimitive.Item
			className={cn(
				"relative flex w-full flex-row items-center gap-2.5 rounded-2xl py-2 pr-8 pl-3 text-sm font-medium",
				Platform.select({
					web: "not-data-[variant=destructive]:focus:**:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-default outline-hidden outline-none select-none data-disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
				}),
				props.disabled && "opacity-50",
				className,
			)}
			{...props}
		>
			<View className="absolute right-2 flex size-3.5 items-center justify-center">
				<SelectPrimitive.ItemIndicator>
					<Icon as={Check} className="text-muted-foreground size-4 shrink-0" />
				</SelectPrimitive.ItemIndicator>
			</View>
			<SelectPrimitive.ItemText className="text-foreground group-active:text-accent-foreground text-sm select-none" />
		</SelectPrimitive.Item>
	);
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
	return <SelectPrimitive.Separator className={cn("bg-border -mx-1 my-1 h-px", Platform.select({ web: "pointer-events-none" }), className)} {...props} />;
}

/**
 * @platform Web only
 * Returns null on native platforms
 */
function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
	if (Platform.OS !== "web") {
		return null;
	}
	return (
		<SelectPrimitive.ScrollUpButton className={cn("flex cursor-default items-center justify-center py-1", className)} {...props}>
			<Icon as={ChevronUpIcon} className="size-4" />
		</SelectPrimitive.ScrollUpButton>
	);
}

/**
 * @platform Web only
 * Returns null on native platforms
 */
function SelectScrollDownButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
	if (Platform.OS !== "web") {
		return null;
	}
	return (
		<SelectPrimitive.ScrollDownButton className={cn("flex cursor-default items-center justify-center py-1", className)} {...props}>
			<Icon as={ChevronDownIcon} className="size-4" />
		</SelectPrimitive.ScrollDownButton>
	);
}

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
	type Option,
};

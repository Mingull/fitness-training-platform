import { cn } from "@fitness/ui/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { Pressable, View } from "react-native";
import { FadeIn, FadeOut } from "react-native-reanimated";
import { Button, buttonVariants } from "./button";
import { NativeOnlyAnimatedView } from "./native-only-animated-view";
import { Text } from "./text";

type FABContext = {
	isExtended: boolean;
	extendFAB: () => void;
	setIsExtended: React.Dispatch<React.SetStateAction<boolean>>;
	showLabel: boolean;
	extendTitleOnLongPress: boolean;
} & VariantProps<typeof fabVariants>;

const FABContext = React.createContext<FABContext | undefined>(undefined);

const useFABContext = () => {
	const context = React.use(FABContext);
	if (!context) {
		throw new Error("useFABContext must be used within the FAB component");
	}
	return context;
};

type FABProps = {
	disabled?: boolean;
	alwaysShowLabel?: boolean;
	extendTitleOnLongPress?: boolean;
	children: React.ReactNode;
} & React.ComponentProps<typeof View> &
	VariantProps<typeof fabVariants>;

const fabVariants = cva("absolute", {
	variants: {
		position: {
			"bottom-right": "",
			"bottom-left": "",
			"top-right": "",
			"top-left": "",
		},
		spacing: {
			sm: "right-2 bottom-2",
			default: "right-4 bottom-4",
			lg: "right-6 bottom-6",
		},
	},
	compoundVariants: [
		{ position: "bottom-left", spacing: "sm", className: "left-2 bottom-2" },
		{ position: "bottom-left", spacing: "default", className: "left-4 bottom-4" },
		{ position: "bottom-left", spacing: "lg", className: "left-6 bottom-6" },
		{ position: "top-right", spacing: "sm", className: "right-2 top-2" },
		{ position: "top-right", spacing: "default", className: "right-4 top-4" },
		{ position: "top-right", spacing: "lg", className: "right-6 top-6" },
		{ position: "top-left", spacing: "sm", className: "left-2 top-2" },
		{ position: "top-left", spacing: "default", className: "left-4 top-4" },
		{ position: "top-left", spacing: "lg", className: "left-6 top-6" },
	],
	defaultVariants: {
		position: "bottom-right",
		spacing: "default",
	},
});

function FAB({
	disabled,
	position = "bottom-right",
	spacing = "default",
	alwaysShowLabel = false,
	extendTitleOnLongPress = true,
	children,
	className,
	...props
}: FABProps) {
	const [isExtended, setIsExtended] = React.useState(false);
	const extendTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

	const extendFAB = React.useCallback(() => {
		if (!extendTitleOnLongPress) {
			return;
		}

		setIsExtended(true);

		if (extendTimeoutRef.current) {
			clearTimeout(extendTimeoutRef.current);
		}

		extendTimeoutRef.current = setTimeout(() => {
			setIsExtended(false);
			extendTimeoutRef.current = null;
		}, 2000);
	}, [extendTitleOnLongPress]);

	const showLabel = alwaysShowLabel || isExtended;

	return (
		<FABContext.Provider value={{ isExtended, extendFAB, setIsExtended, showLabel, extendTitleOnLongPress, position, spacing }}>
			<View className={cn(fabVariants({ position, spacing }), className, disabled && "hidden")} {...props}>
				{children}
			</View>
		</FABContext.Provider>
	);
}

type FABTriggerProps = React.ComponentProps<typeof Pressable>;

function FABTrigger({ className, children, onLongPress, ...props }: FABTriggerProps) {
	const { extendFAB, isExtended } = useFABContext();

	return (
		<Pressable
			className={cn("flex-row items-center justify-center", className)}
			accessibilityState={{ expanded: isExtended }}
			role="button"
			hitSlop={12}
			onLongPress={(event) => {
				onLongPress?.(event);
				extendFAB();
			}}
			{...props}
		>
			{children}
		</Pressable>
	);
}

function FABAction({ className, ...props }: React.ComponentProps<typeof View>) {
	return <View pointerEvents="none" className={cn(buttonVariants({ size: "icon-2xl" }), className)} {...props} />;
}

type FABTitleProps = React.ComponentProps<typeof Text>;

function FABLabel({ className, ...props }: FABTitleProps) {
	const { showLabel } = useFABContext();
	if (!showLabel) {
		return null;
	}

	return (
		<NativeOnlyAnimatedView
			entering={FadeIn.duration(150).withInitialValues({ opacity: 0, transform: [{ translateX: -6 }] })}
			exiting={FadeOut.duration(100)}
		>
			<Text className={cn("text-foreground m-2 text-sm font-medium", className)} {...props} />
		</NativeOnlyAnimatedView>
	);
}

const fabSpeedDialVariants = cva("absolute", {
	variants: {
		position: {
			"bottom-right": "right-4 bottom-16",
			"bottom-left": "left-4 bottom-16",
			"top-right": "right-4 top-16",
			"top-left": "left-4 top-16",
		},
		spacing: {
			sm: "right-2 bottom-14",
			default: "right-4 bottom-16",
			lg: "right-6 bottom-18",
		},
	},
	defaultVariants: {},
});

function FABSpeedDial({ className, ...props }: React.ComponentProps<typeof View>) {
	const { isExtended, position, spacing } = useFABContext();
	return <View className={cn(fabSpeedDialVariants({ position, spacing }), { hidden: !isExtended }, className)} {...props} />;
}

const fabSpeedDialItemVariants = cva("absolute", {
	variants: {},
	defaultVariants: {},
});

type FABSpeedDialItemProps = React.ComponentProps<typeof View> & VariantProps<typeof fabSpeedDialItemVariants>;

function FABSpeedDialItem({ className, ...props }: FABSpeedDialItemProps) {
	return <View className={cn("flex-row items-center gap-3", className)} {...props} />;
}

function FABSpeedDialTrigger({ ...props }: React.ComponentProps<typeof Button>) {
	return <Button size="icon" {...props} />;
}

function FABSpeedDialLabel({ className, ...props }: React.ComponentProps<typeof Text>) {
	return <Text className={cn("text-muted-foreground text-sm font-medium", className)} {...props} />;
}

export { FAB, FABAction, FABLabel, FABSpeedDial, FABSpeedDialItem, FABSpeedDialLabel, FABSpeedDialTrigger, FABTrigger };

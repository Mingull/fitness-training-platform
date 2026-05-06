import { Icon } from "@/components/ui/icon";
import { cn } from "@fitness/ui/lib/utils";
import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import { Check } from "lucide-react-native";
import { Platform } from "react-native";

const DEFAULT_HIT_SLOP = 24;

function Checkbox({
	className,
	checkedClassName,
	indicatorClassName,
	iconClassName,
	...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
	checkedClassName?: string;
	indicatorClassName?: string;
	iconClassName?: string;
}) {
	return (
		<CheckboxPrimitive.Root
			className={cn(
				"bg-input/90 dark:bg-input/20 data-checked:border-primary data-checked:bg-primary dark:data-checked:bg-primary relative flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-transparent transition-shadow group-has-disabled/field:opacity-50 disabled:opacity-50",
				Platform.select({
					web: "focus-visible:border-ring aria-invalid:ring-destructive/20 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:aria-checked:border-primary dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 peer cursor-default transition-shadow outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 disabled:cursor-not-allowed aria-invalid:ring-3",
					native: "overflow-hidden",
				}),
				props.checked && cn("border-primary", checkedClassName),
				props.disabled && "opacity-50",
				className,
			)}
			hitSlop={DEFAULT_HIT_SLOP}
			{...props}
		>
			<CheckboxPrimitive.Indicator className={cn("bg-primary h-full w-full items-center justify-center", indicatorClassName)}>
				<Icon
					as={Check}
					size={12}
					strokeWidth={Platform.OS === "web" ? 2.5 : 3.5}
					className={cn("text-primary-foreground data-checked:text-primary-foreground", iconClassName)}
				/>
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };

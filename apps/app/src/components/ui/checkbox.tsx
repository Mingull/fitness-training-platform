import { Icon } from "@/components/ui/icon";
import { cn } from "@fitness/ui/lib/utils";
import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import { Check } from "lucide-react-native";
import { Platform } from "react-native";

const DEFAULT_HIT_SLOP = 24;

function Checkbox({
	className,
	indicatorClassName,
	iconClassName,
	...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
	indicatorClassName?: string;
	iconClassName?: string;
}) {
	return (
		<CheckboxPrimitive.Root
			className={cn(
				"peer bg-input relative flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-transparent transition-shadow outline-none group-has-disabled/field:opacity-50",
				Platform.select({
					web: "focus-visible:border-ring focus-visible:ring-ring/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 disabled:cursor-not-allowed aria-invalid:ring-3",
				}),
				props.checked && "bg-primary text-primary-foreground border-primary",
				props.disabled && "opacity-50",
				className,
			)}
			hitSlop={DEFAULT_HIT_SLOP}
			{...props}
		>
			<CheckboxPrimitive.Indicator className={cn("bg-primary h-full w-full items-center justify-center", indicatorClassName)}>
				<Icon
					as={Check}
					size={14}
					strokeWidth={Platform.OS === "web" ? 2.5 : 3.5}
					className={cn("text-primary", iconClassName)}
				/>
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };

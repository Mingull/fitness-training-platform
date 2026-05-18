import { cn } from "@fitness/ui/lib/utils";
import * as RadioGroupPrimitive from "@rn-primitives/radio-group";
import { Platform, View } from "react-native";

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
	return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("w-full gap-3", className)} {...props} />;
}

function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
	return (
		<RadioGroupPrimitive.Item
			className={cn(
				"group/radio-group-item peer bg-input/90 data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary relative flex aspect-square size-4 shrink-0 rounded-full border border-transparent outline-none after:absolute after:-inset-x-3 after:-inset-y-2",
				Platform.select({
					web: "focus-visible:border-ring dark:aria-invalid:border-destructive/50 focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all outline-none focus-visible:ring-3 disabled:cursor-not-allowed aria-invalid:ring-3",
				}),
				props.disabled && "opacity-50",
				className,
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className="flex size-4 items-center justify-center">
				<View className="bg-primary-foreground absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
}

export { RadioGroup, RadioGroupItem };

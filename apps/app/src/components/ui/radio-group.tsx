import { cn } from "@fitness/ui/lib/utils";
import * as RadioGroupPrimitive from "@rn-primitives/radio-group";
import { Platform, View } from "react-native";

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
	return <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("w-full gap-3", className)} {...props} />;
}

function RadioGroupItem({ className, disabled, checked, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item> & { checked?: boolean }) {
	return (
		<RadioGroupPrimitive.Item
			data-slot="radio-item"
			className={cn(
				// base
				"group/radio-item peer bg-input relative flex aspect-square size-4 shrink-0 rounded-full border border-transparent outline-none after:absolute after:-inset-x-3 after:-inset-y-2",
				{
					"bg-primary text-primary-foreground": checked,
					// explicit disabled handling (more reliable than CSS inference)
					"opacity-50": disabled,
				},
				// web-only enhancements
				Platform.select({
					web: "focus-visible:border-ring dark:aria-invalid:border-destructive/50 focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary transition-all focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3",
				}),
				className,
			)}
			{...props}
		>
			<RadioGroupPrimitive.Indicator className="flex size-full items-center justify-center">
				{/* <View className="bg-primary-foreground absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full" /> */}
				<View className="bg-primary-foreground size-1.5 rounded-full" />
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
}

export { RadioGroup, RadioGroupItem };

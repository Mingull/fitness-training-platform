import * as SliderPrimitive from "@/components/primitives/slider";
import { cn } from "@fitness/ui/lib/utils";
import * as React from "react";
import { Platform } from "react-native";

function Slider({
	className,
	defaultValue,
	onValueChange,
	value,
	min = 0,
	max = 100,
	orientation = "horizontal",
	disabled = false,
	...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
	orientation?: "horizontal" | "vertical";
	disabled?: boolean;
}) {
	const _values = React.useMemo(
		() =>
			Array.isArray(value) ? value
			: Array.isArray(defaultValue) ? defaultValue
			: [min, max],
		[value, defaultValue, min, max],
	);

	return (
		<SliderPrimitive.Root
			data-slot="slider"
			defaultValue={defaultValue}
			value={value}
			min={min}
			max={max}
			onValueChange={onValueChange}
			orientation={orientation}
			disabled={disabled}
			className={cn(
				"relative flex",
				Platform.select({
					web: "touch-none select-none",
				}),
				orientation === "horizontal" && "h-auto w-full justify-center",
				orientation === "vertical" && "h-full min-h-40 w-auto flex-col items-center",
				disabled && "opacity-50",
				className,
			)}
			{...props}
		>
			<SliderPrimitive.Track
				data-slot="slider-track"
				className={cn(
					"bg-input/90 relative grow overflow-hidden rounded-full",
					orientation === "horizontal" && "h-2 w-full",
					orientation === "vertical" && "h-full w-2",
				)}
			>
				<SliderPrimitive.Range
					data-slot="slider-range"
					className={cn(
						"bg-primary absolute",
						Platform.select({ web: "select-none" }),
						orientation === "horizontal" && "h-full",
						orientation === "vertical" && "w-full",
					)}
				/>
			</SliderPrimitive.Track>
			{Array.from({ length: _values.length }, (_, index) => (
				<SliderPrimitive.Thumb
					data-slot="slider-thumb"
					key={index}
					index={index}
					className={cn(
						"shrink-0 rounded-full bg-white shadow-md transition-[color,box-shadow,background-color]",
						Platform.select({
							web: "hover:ring-ring/30 focus-visible:ring-ring/30 ring-1 ring-black/10 select-none not-dark:bg-clip-padding hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none",
						}),
						orientation === "horizontal" && "h-4 w-6",
						orientation === "vertical" && "h-6 w-4",
						disabled && "opacity-50",
					)}
				/>
			))}
		</SliderPrimitive.Root>
	);
}

export { Slider };

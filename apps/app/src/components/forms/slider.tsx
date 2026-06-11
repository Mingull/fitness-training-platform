import { FormBase, FormControlProps } from "@/components/forms/base";
import { Slider } from "@/components/ui/slider";
import { useFieldContext } from "@/hooks/forms";

export function FormSlider({ label, description, className, inputClassName, ...props }: FormControlProps & React.ComponentProps<typeof Slider>) {
	const field = useFieldContext<number[]>();

	return (
		<FormBase label={label} description={description} className={className}>
			{(isInvalid) => (
				<Slider
					id={field.name}
					onBlur={field.handleBlur}
					aria-invalid={isInvalid}
					value={field.state.value}
					onValueChange={field.handleChange}
					className={inputClassName}
					{...props}
				/>
			)}
		</FormBase>
	);
}

import { FormBase, FormControlProps } from "@/components/forms/base";
import { Input } from "@/components/ui/input";
import { useFieldContext } from "@/hooks/forms";
import { ComponentProps } from "react";

export function FormInput({ label, description, errorComponent, ...props }: FormControlProps & ComponentProps<typeof Input>) {
	const field = useFieldContext<string>();

	return (
		<FormBase label={label} description={description} horizontal errorComponent={errorComponent} {...props}>
			{(isInvalid) => (
				<Input
					id={field.name}
					value={field.state.value}
					onBlur={field.handleBlur}
					onChangeText={field.handleChange}
					aria-invalid={isInvalid}
					{...props}
				/>
			)}
		</FormBase>
	);
}

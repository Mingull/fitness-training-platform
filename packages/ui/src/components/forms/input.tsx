import { useFieldContext } from "@fitness/ui/hooks/forms";
import { Input } from "@fitness/ui/components/input";
import { FormBase, FormControlProps } from "@fitness/ui/components/forms/base";
import { ComponentProps } from "react";

export function FormInput({ label, description, ...props }: FormControlProps & ComponentProps<"input">) {
	const field = useFieldContext<string>();

	return (
		<FormBase label={label} description={description}>
			{(isInvalid) => (
				<Input
					id={field.name}
					name={field.name}
					value={field.state.value}
					onBlur={field.handleBlur}
					onChange={(e) => field.handleChange(e.target.value)}
					aria-invalid={isInvalid}
					{...props}
				/>
			)}
		</FormBase>
	);
}

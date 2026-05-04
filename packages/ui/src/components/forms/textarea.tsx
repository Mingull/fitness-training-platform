import { useFieldContext } from "@fitness/ui/hooks/forms";
import { Textarea } from "@fitness/ui/components/textarea";
import { FormBase, FormControlProps } from "@fitness/ui/components/forms/base";
import { ComponentProps } from "react";

export function FormTextarea({ label, description, ...props }: FormControlProps & ComponentProps<"textarea">) {
	const field = useFieldContext<string>();

	return (
		<FormBase label={label} description={description}>
			{(isInvalid) => (
				<Textarea
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

import { FormBase, FormControlProps } from "@/components/forms/base";
import { Textarea } from "@/components/ui/textarea";
import { useFieldContext } from "@/hooks/forms";
import { ComponentProps } from "react";

export function FormTextarea({ label, description, ...props }: FormControlProps & ComponentProps<typeof Textarea>) {
	const field = useFieldContext<string>();

	return (
		<FormBase label={label} description={description}>
			{(isInvalid) => (
				<Textarea
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

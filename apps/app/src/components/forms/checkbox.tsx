import { FormBase, FormControlProps } from "@/components/forms/base";
import { Checkbox } from "@/components/ui/checkbox";
import { useFieldContext } from "@/hooks/forms";

export function FormCheckbox({ label, description, className }: FormControlProps) {
	const field = useFieldContext<boolean>();

	return (
		<FormBase label={label} description={description} controlFirst horizontal className={className}>
			{(isInvalid) => (
				<Checkbox
					id={field.name}
					checked={field.state.value}
					onBlur={field.handleBlur}
					onCheckedChange={(e) => field.handleChange(e === true)}
					aria-invalid={isInvalid}
				/>
			)}
		</FormBase>
	);
}

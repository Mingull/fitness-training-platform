import { FormBase, FormControlProps } from "@/components/forms/base";
import { Switch } from "@/components/ui/switch";
import { useFieldContext } from "@/hooks/forms";

export function FormSwitch({ label, description, className }: FormControlProps) {
	const field = useFieldContext<boolean>();

	return (
		<FormBase label={label} description={description} controlFirst horizontal className={className}>
			{(isInvalid) => (
				<Switch
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

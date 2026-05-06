import { FormBase, FormControlProps } from "@/components/forms/base";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFieldContext } from "@/hooks/forms";

export function FormSelect({ children, ...props }: FormControlProps & { children: React.ReactNode }) {
	const field = useFieldContext<string>();

	return (
		<FormBase {...props}>
			{(isInvalid) => (
				<Select onValueChange={(e) => e !== undefined && field.handleChange(e.value)} value={{ value: field.state.value, label: field.state.value }}>
					<SelectTrigger aria-invalid={isInvalid} id={field.name} onBlur={field.handleBlur}>
						<SelectValue placeholder="" />
					</SelectTrigger>
					<SelectContent>{children}</SelectContent>
				</Select>
			)}
		</FormBase>
	);
}

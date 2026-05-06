import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { useFieldContext } from "@/hooks/forms";
import { ReactNode } from "react";

export type FormControlProps = {
	label: string;
	description?: string;
	className?: string;
};

type FormBaseProps = FormControlProps & {
	children: (isInvalid: boolean) => ReactNode;
	horizontal?: boolean;
	controlFirst?: boolean;
};

export function FormBase({ children, label, description, controlFirst, horizontal, className }: FormBaseProps) {
	const field = useFieldContext();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	const labelElement = (
		<>
			<FieldLabel htmlFor={field.name} data-invalid={isInvalid}>
				{label}
			</FieldLabel>
			{description ?
				<FieldDescription>{description}</FieldDescription>
			:	null}
		</>
	);

	const errorElement = isInvalid ? <FieldError errors={field.state.meta.errors} /> : null;

	return (
		<Field data-invalid={isInvalid} orientation={horizontal ? "horizontal" : undefined} className={className}>
			{controlFirst ?
				<>
					{children(isInvalid)}
					<FieldContent>
						{labelElement}
						{errorElement}
					</FieldContent>
				</>
			:	<FieldContent>
					{labelElement}
					{children(isInvalid)}
					{errorElement}
				</FieldContent>
			}
		</Field>
	);
}

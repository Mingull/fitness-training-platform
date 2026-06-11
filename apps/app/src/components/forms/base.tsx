import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { useFieldContext } from "@/hooks/forms";
import { ReactNode } from "react";
import { useTranslations } from "use-intl";

export type FormControlProps = {
	label: string;
	description?: string;
	className?: string;
	inputClassName?: string;
	labelClassName?: string;
	descriptionClassName?: string;
	errorComponent?: ReactNode;
};

type FormBaseProps = FormControlProps & {
	children: (isInvalid: boolean) => ReactNode;
	horizontal?: boolean;
	controlFirst?: boolean;
};

const parseErrorTranslations = (t: ReturnType<typeof useTranslations>, errors: ({ message?: string } | undefined)[]) => {};

export function FormBase({
	children,
	label,
	description,
	controlFirst,
	horizontal,
	className,
	labelClassName,
	descriptionClassName,
	errorComponent,
}: FormBaseProps) {
	const field = useFieldContext();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	const labelElement = (
		<>
			<FieldLabel htmlFor={field.name} data-invalid={isInvalid} className={labelClassName}>
				{label}
			</FieldLabel>
			{description ?
				<FieldDescription className={descriptionClassName}>{description}</FieldDescription>
			:	null}
		</>
	);

	const errorElement =
		isInvalid ?
			errorComponent ? errorComponent
			:	<FieldError errors={field.state.meta.errors} />
		:	null;

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

import { FormCheckbox } from "@fitness/ui/components/forms/checkbox";
import { FormInput } from "@fitness/ui/components/forms/input";
import { FormSelect } from "@fitness/ui/components/forms/select";
import { FormTextarea } from "@fitness/ui/components/forms/textarea";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
	fieldContext,
	fieldComponents: {
		Input: FormInput,
		Textarea: FormTextarea,
		Select: FormSelect,
		Checkbox: FormCheckbox,
	},
	formContext,
	formComponents: {},
});

export { useAppForm, useFieldContext, useFormContext };

import { FormCheckbox } from "@/components/forms/checkbox";
import { FormInput } from "@/components/forms/input";
import { FormSelect } from "@/components/forms/select";
import { FormSlider } from "@/components/forms/slider";
import { FormSwitch } from "@/components/forms/switch";
import { FormTextarea } from "@/components/forms/textarea";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

const { useAppForm, withForm, withFieldGroup, useTypedAppFormContext } = createFormHook({
	fieldContext,
	fieldComponents: {
		Input: FormInput,
		Textarea: FormTextarea,
		Select: FormSelect,
		Checkbox: FormCheckbox,
		Switch: FormSwitch,
		Slider: FormSlider,
	},
	formContext,
	formComponents: {},
});

export { useAppForm, useFieldContext, useFormContext, useTypedAppFormContext, withFieldGroup, withForm };

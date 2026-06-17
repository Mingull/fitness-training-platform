import { FormBase, FormControlProps } from "@/components/forms/base";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFieldContext } from "@/hooks/forms";
import { Option, TriggerRef } from "@rn-primitives/select";
import { useRef, useState } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FormSelectProps = FormControlProps & {
	portalHost?: string;
	placeholder: string;
	children: React.ReactNode;
	/**
	 * This callback is used when you want to update the label of the select trigger based on the selected option.
	 * It receives the value of the selected option and should return the new label to be displayed in the trigger.
	 */
	onOptionChange?: (value: string) => string;
};

export function FormSelect({ children, placeholder, portalHost, onOptionChange, ...props }: FormSelectProps) {
	const [label, setLabel] = useState<string>("");
	const field = useFieldContext<string>();
	const ref = useRef<TriggerRef>(null);
	const insets = useSafeAreaInsets();

	const contentInsets = {
		top: insets.top,
		bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
		left: 12,
		right: 12,
	};

	const handleValueChange = (option?: Option) => {
		if (option) {
			field.handleChange(option.value);
			if (onOptionChange) {
				const newLabel = onOptionChange(option.value);
				setLabel(newLabel);
			} else {
				setLabel(option.label);
			}
		}
	};

	return (
		<FormBase {...props} horizontal>
			{(isInvalid) => (
				<Select onValueChange={handleValueChange} value={field.state.value !== "" ? { value: field.state.value, label: label } : undefined}>
					<SelectTrigger ref={ref}>
						<SelectValue placeholder={placeholder} />
					</SelectTrigger>
					<SelectContent insets={contentInsets} portalHost={portalHost}>
						{children}
					</SelectContent>
				</Select>
			)}
		</FormBase>
	);
}

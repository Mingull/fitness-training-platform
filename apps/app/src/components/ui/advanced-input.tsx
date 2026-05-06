import { Requirement } from "@fitness/ui/components/advanced-input";
import { cn } from "@fitness/ui/lib/utils";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react-native";
import { useId, useMemo, useState } from "react";
import { View } from "react-native";
import { Icon } from "./icon";
import { Input } from "./input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group";
import { Text } from "./text";

type Strength = {
	/**
	 * Color indicating whether the requirement is met
	 */
	color: string;
	/**
	 * Optional text description of the requirement
	 */
	text?: string;
};

type InputProps<R extends Requirement[] = Requirement[]> = {
	/**
	 * Array of password requirements to validate against. If not provided, default requirements will be used.
	 */
	requirements?: R;
	/**
	 * Optional callback that receives the current strength score whenever it changes. Can be used to customize the strength indicator.
	 * @param strength The current strength score, calculated as the number of requirements met. Ranges from 0 to the total number of requirements.
	 * @returns An object containing a color and optional text description for the strength indicator. If not provided, a default strength indicator will be used based on the strength score.
	 */
	onStrengthChange?: (strength: R["length"]) => Strength;
} & React.ComponentProps<typeof Input>;

export function AdvancedInput({ id, requirements, onStrengthChange, className, placeholder, ref, ...props }: InputProps) {
	const internalId = useId();
	const inputId = id || internalId;

	const [isVisible, setIsVisible] = useState<boolean>(false);
	const toggleVisibility = () => setIsVisible((prevState) => !prevState);
	const [inputFocused, setIsFocused] = useState<boolean>(false);

	const value = props.value?.toString() || "";

	const checkStrength = (pass: string) => {
		const _requirements: Requirement[] = requirements ?? [
			{ type: "min", value: 8, text: "At least 8 characters", flags: undefined },
			{ type: "max", value: 12, text: "At most 12 characters", flags: undefined },
			{ type: "regex", pattern: /[0-9]/, text: "At least 1 numbers", flags: undefined },
			{ type: "regex", pattern: /[a-z]/, text: "At least 1 lowercase letters", flags: undefined },
			{ type: "regex", pattern: /[A-Z]/, text: "At least 1 uppercase letter", flags: undefined },
		];

		return _requirements.map((req) => {
			if (req.type === "min") return { met: pass.length >= req.value, text: req.text, flags: req.flags };
			if (req.type === "max") return { met: pass.length <= req.value, text: req.text, flags: req.flags };
			if (req.type === "length") return { met: pass.length === req.value, text: req.text, flags: req.flags };
			if (req.type === "regex") return { met: req.pattern.test(pass), text: req.text, flags: req.flags };
			if (req.type === "includes") return { met: pass.includes(req.substring), text: req.text, flags: req.flags };
			if (req.type === "excludes") return { met: !pass.includes(req.substring), text: req.text, flags: req.flags };
			if (req.type === "starts-with") return { met: pass.startsWith(req.value), text: req.text, flags: req.flags };
			if (req.type === "ends-with") return { met: pass.endsWith(req.value), text: req.text, flags: req.flags };
			if (req.type === "no-repeats") {
				const match = pass.match(/(.)\1+/g);
				return { met: !match || match.every((r) => r.length <= req.max), text: req.text, flags: req.flags };
			}
			if (req.type === "custom") return { met: req.validate(pass), text: req.text, flags: req.flags };
			return { met: false, text: "Unknown requirement", flags: undefined };
		});
	};

	const strength = checkStrength(value).filter((req) => !req.flags?.includes("hidden"));

	const strengthScore = useMemo(() => {
		return strength.filter((req) => req.met).length;
	}, [strength]);

	const getDefaultStrength = (strength: number) => {
		if (strength === 0) return { color: "bg-border", text: "Enter a password" };
		if (strength <= 1) return { color: "bg-red-500", text: "Very weak password" };
		if (strength <= 2) return { color: "bg-orange-500", text: "Weak password" };
		if (strength === 3) return { color: "bg-amber-500", text: "Medium password" };
		return { color: "bg-emerald-500", text: "Strong password" };
	};

	const getStrength = onStrengthChange ?? getDefaultStrength;

	return (
		<View className={cn("group space-y-2", className)}>
			<InputGroup>
				{/* Password input field with toggle visibility button */}
				<InputGroupInput
					ref={ref}
					id={inputId}
					className={"pe-9"}
					placeholder={placeholder}
					aria-describedby={`${inputId}-description`}
					{...props}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					onSubmitEditing={(e) => {
						setIsFocused(false);
						props.onSubmitEditing?.(e);
					}}
					secureTextEntry={!isVisible}
				/>
				{props.textContentType === "password" ?
					<InputGroupAddon align="inline-end">
						<InputGroupButton
							variant="ghost"
							className="text-muted-foreground/80"
							onPress={toggleVisibility}
							aria-label={isVisible ? "Hide password" : "Show password"}
							aria-pressed={isVisible}
							aria-controls={inputId}
						>
							{isVisible ?
								<Icon as={EyeOffIcon} />
							:	<Icon as={EyeIcon} />}
						</InputGroupButton>
					</InputGroupAddon>
				:	null}
			</InputGroup>

			<View className={cn("w-full flex-col space-y-2", { hidden: !inputFocused || strengthScore === 0 })}>
				{/* Password strength indicator */}
				<View
					className="bg-border mt-3 mb-4 h-1 w-full flex-row overflow-hidden rounded-full"
					role="progressbar"
					aria-valuenow={strengthScore}
					aria-valuemin={0}
					aria-valuemax={4}
					aria-label="Password strength"
				>
					<View
						className={`h-full ${getStrength(strengthScore).color} transition-all duration-500 ease-out`}
						style={{ width: `${(strengthScore / strength.length) * 100}%` }}
					></View>
				</View>

				{/* Password strength description */}
				<Text id={`${inputId}-description`} className="text-foreground mb-2 text-sm font-medium">
					{getStrength(strengthScore).text}. Must contain:
				</Text>

				{/* Password requirements list */}
				<View className="space-y-1.5" aria-label="Password requirements">
					{strength.map((req, index) =>
						req.flags?.includes("hidden") ?
							null
						:	<View key={index} className="flex flex-row items-center gap-2">
								{req.met ?
									<Icon as={CheckIcon} className="text-emerald-500" />
								:	<Icon as={XIcon} className="text-muted-foreground/80" />}
								<Text className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}>
									{req.text}
									{/* I need to find a way to make this accessible without showing the text visually. I want screen readers to read out whether each requirement is met or not, but I don't want that text to be visible on the screen. */}
									{/*<Text accessible={true} className="sr-only">
										{req.met ? " - Requirement met" : " - Requirement not met"}
									</Text> */}
								</Text>
							</View>,
					)}
				</View>
			</View>
		</View>
	);
}

import { Slot } from "@/components/primitives/slot";
import * as React from "react";
import { LayoutChangeEvent, PanResponder, View } from "react-native";
import type { RangeProps, RangeRef, RootProps, RootRef, ThumbProps, ThumbRef, TrackProps, TrackRef } from "./types";

function normalizeValues(input: unknown): number[] {
	if (Array.isArray(input)) {
		return input.filter((item): item is number => typeof item === "number" && Number.isFinite(item));
	}
	if (typeof input === "number" && Number.isFinite(input)) {
		return [input];
	}
	return [];
}

type SliderContextValue = {
	value: number[];
	min: number;
	max: number;
	disabled: boolean;
	orientation: "horizontal" | "vertical";
	trackLength: number;
	activeThumbIndex: number;
	setActiveThumbIndex: (index: number) => void;
	setTrackLength: (length: number) => void;
	updateValueFromPosition: (position: number) => void;
	getThumbPosition: (index: number) => number;
};

const RootContext = React.createContext<SliderContextValue | null>(null);
type RootComponentProps = RootProps & React.RefAttributes<RootRef>;

const Root = ({
	asChild,
	value,
	defaultValue,
	onValueChange,
	disabled = false,
	min = 0,
	max = 100,
	orientation = "horizontal",
	step,
	dir: _dir,
	inverted: _inverted,
	ref,
	...props
}: RootComponentProps) => {
	const isControlled = value !== undefined;
	const initialValue = React.useMemo(() => {
		const controlledValues = normalizeValues(value);
		if (controlledValues.length > 0) {
			return controlledValues;
		}
		const defaultValues = normalizeValues(defaultValue);
		if (defaultValues.length > 0) {
			return defaultValues;
		}
		return [min];
	}, [value, defaultValue, min, max]);
	const [uncontrolledValue, setUncontrolledValue] = React.useState(initialValue);
	const [trackLength, setTrackLength] = React.useState(0);
	const [activeThumbIndex, setActiveThumbIndex] = React.useState(0);

	React.useEffect(() => {
		if (!isControlled) {
			setUncontrolledValue(initialValue);
		}
	}, [initialValue, isControlled]);

	const currentValue = React.useMemo(() => {
		const source = isControlled ? value : uncontrolledValue;
		const normalized = normalizeValues(source);
		return normalized.length > 0 ? normalized : initialValue;
	}, [initialValue, isControlled, uncontrolledValue, value]);

	const snapValue = React.useCallback(
		(nextValue: number) => {
			const clamped = Math.min(max, Math.max(min, nextValue));
			if (!step || step <= 0) {
				return clamped;
			}
			const stepped = Math.round((clamped - min) / step) * step + min;
			return Math.min(max, Math.max(min, stepped));
		},
		[max, min, step],
	);

	const emitChange = React.useCallback(
		(nextValue: number[]) => {
			const normalizedNextValue = normalizeValues(nextValue);
			if (normalizedNextValue.length === 0) {
				return;
			}
			if (!isControlled) {
				setUncontrolledValue(normalizedNextValue);
			}
			if (typeof onValueChange === "function") {
				onValueChange(normalizedNextValue);
			}
		},
		[isControlled, onValueChange],
	);

	const getThumbPosition = React.useCallback(
		(index: number) => {
			const range = max - min;
			if (range <= 0 || trackLength <= 0) {
				return 0;
			}
			const normalized = ((currentValue[index] ?? min) - min) / range;
			const clamped = Math.min(1, Math.max(0, normalized));
			const distance = clamped * trackLength;
			return orientation === "vertical" ? trackLength - distance : distance;
		},
		[currentValue, max, min, orientation, trackLength],
	);

	const updateValueFromPosition = React.useCallback(
		(position: number) => {
			const length = trackLength > 0 ? trackLength : 1;
			const normalized = Math.min(1, Math.max(0, position / length));
			const rawValue = orientation === "vertical" ? max - normalized * (max - min) : min + normalized * (max - min);
			const nextValue = snapValue(rawValue);
			const nextValues = currentValue.length > 0 ? [...currentValue] : [nextValue];
			const targetIndex = Math.min(activeThumbIndex, nextValues.length - 1);
			nextValues[targetIndex] = nextValue;
			if (nextValues.length > 1) {
				if (targetIndex > 0) {
					nextValues[targetIndex] = Math.max(nextValues[targetIndex], nextValues[targetIndex - 1]);
				}
				if (targetIndex < nextValues.length - 1) {
					nextValues[targetIndex] = Math.min(nextValues[targetIndex], nextValues[targetIndex + 1]);
				}
			}
			emitChange(nextValues);
		},
		[activeThumbIndex, currentValue, emitChange, max, min, orientation, snapValue, trackLength],
	);

	const contextValue = React.useMemo(
		() => ({
			value: currentValue,
			min,
			max,
			disabled,
			orientation,
			trackLength,
			activeThumbIndex,
			setActiveThumbIndex,
			setTrackLength,
			updateValueFromPosition,
			getThumbPosition,
		}),
		[activeThumbIndex, currentValue, disabled, getThumbPosition, max, min, orientation, trackLength, updateValueFromPosition],
	);
	const Component = asChild ? Slot : View;
	return (
		<RootContext.Provider value={contextValue}>
			<Component ref={ref} role="group" {...props} />
		</RootContext.Provider>
	);
};

Root.displayName = "RootNativeSlider";

function useSliderContext() {
	const context = React.useContext(RootContext);
	if (context === null) {
		throw new Error("Slider compound components cannot be rendered outside the Slider component");
	}
	return context;
}
type TrackComponentProps = TrackProps & React.RefAttributes<TrackRef>;

const Track = ({ asChild, ref, onLayout, ...props }: TrackComponentProps) => {
	const { value, min, max, disabled, orientation, setTrackLength, setActiveThumbIndex, updateValueFromPosition, getThumbPosition } = useSliderContext();

	const Component = asChild ? Slot : View;
	const handleLayout = React.useCallback(
		(event: LayoutChangeEvent) => {
			const layout = event.nativeEvent.layout;
			setTrackLength(orientation === "vertical" ? layout.height : layout.width);
			if (typeof onLayout === "function") {
				onLayout(event);
			}
		},
		[onLayout, orientation, setTrackLength],
	);
	const panResponder = React.useMemo(
		() =>
			PanResponder.create({
				onStartShouldSetPanResponder: () => !disabled,
				onStartShouldSetPanResponderCapture: () => !disabled,
				onMoveShouldSetPanResponder: () => !disabled,
				onMoveShouldSetPanResponderCapture: () => !disabled,
				onPanResponderTerminationRequest: () => false,
				onPanResponderGrant: (event) => {
					const position = orientation === "vertical" ? event.nativeEvent.locationY : event.nativeEvent.locationX;
					const nearestIndex =
						value.length <= 1 ?
							0
						:	value.reduce((closestIndex, _candidate, candidateIndex) => {
								const closestDistance = Math.abs(getThumbPosition(closestIndex) - position);
								const candidateDistance = Math.abs(getThumbPosition(candidateIndex) - position);
								return candidateDistance < closestDistance ? candidateIndex : closestIndex;
							}, 0);
					setActiveThumbIndex(nearestIndex);
					updateValueFromPosition(position);
				},
				onPanResponderMove: (event) => {
					const position = orientation === "vertical" ? event.nativeEvent.locationY : event.nativeEvent.locationX;
					updateValueFromPosition(position);
				},
			}),
		[disabled, getThumbPosition, orientation, setActiveThumbIndex, updateValueFromPosition, value.length],
	);
	return (
		<Component
			ref={ref}
			aria-disabled={disabled}
			role="slider"
			aria-valuemin={min}
			aria-valuemax={max}
			aria-valuenow={value[0] ?? min}
			accessibilityValue={{ max, min, now: value[0] ?? min }}
			onLayout={handleLayout}
			{...panResponder.panHandlers}
			{...props}
		/>
	);
};

Track.displayName = "TrackNativeSlider";
type RangeComponentProps = RangeProps & React.RefAttributes<RangeRef>;

const Range = ({ asChild, ref, ...props }: RangeComponentProps) => {
	const { value, orientation, trackLength, getThumbPosition } = useSliderContext();
	const Component = asChild ? Slot : View;
	const positions = value.map((_, index) => getThumbPosition(index)).sort((left, right) => left - right);
	const start = positions.length > 1 ? positions[0] : 0;
	const end = positions.length > 1 ? positions[positions.length - 1] : (positions[0] ?? 0);
	const style =
		orientation === "vertical" ?
			{
				position: "absolute" as const,
				top: end,
				height: Math.max(trackLength - end, 0),
			}
		:	{
				position: "absolute" as const,
				left: start,
				width: Math.max(end - start, 0),
			};
	return <Component ref={ref} role="presentation" style={style} {...props} />;
};

Range.displayName = "RangeNativeSlider";
type ThumbComponentProps = ThumbProps & React.RefAttributes<ThumbRef>;

const Thumb = ({ asChild, index = 0, ref, ...props }: ThumbComponentProps) => {
	const { getThumbPosition, orientation } = useSliderContext();
	const Component = asChild ? Slot : View;
	const position = getThumbPosition(index);
	const style =
		orientation === "vertical" ?
			{
				position: "absolute" as const,
				top: position,
				transform: [{ translateY: -12 }],
			}
		:	{
				position: "absolute" as const,
				left: position,
				transform: [{ translateX: -12 }],
			};
	return <Component accessibilityRole="adjustable" ref={ref} style={style} pointerEvents="none" {...props} />;
};

Thumb.displayName = "ThumbNativeSlider";

export { Range, Root, Thumb, Track };

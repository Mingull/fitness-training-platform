import type { SlottableViewProps, ViewRef } from "@/components/primitives/types";

type RootProps = SlottableViewProps & {
	value?: number[];
	defaultValue?: number[];
	disabled?: boolean;
	min?: number;
	max?: number;
	orientation?: "horizontal" | "vertical";
	/**
	 * Platform: WEB ONLY
	 */
	dir?: "ltr" | "rtl";
	/**
	 * Platform: WEB ONLY
	 */
	inverted?: boolean;
	/**
	 * Platform: WEB ONLY
	 */
	step?: number;
	/**
	 * Platform: WEB ONLY
	 */
	onValueChange?: (value: number[]) => void;
};

type TrackProps = SlottableViewProps;
type RangeProps = SlottableViewProps;
type ThumbProps = SlottableViewProps & {
	index?: number;
};

type RootRef = ViewRef;
type TrackRef = ViewRef;
type RangeRef = ViewRef;
type ThumbRef = ViewRef;

export type { RangeProps, RangeRef, RootProps, RootRef, ThumbProps, ThumbRef, TrackProps, TrackRef };

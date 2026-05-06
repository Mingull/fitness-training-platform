import React, { isValidElement, useCallback, useLayoutEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, Text, TextProps, View } from "react-native";

type BalancerProps = TextProps & {
	asChild?: boolean;
	ratio?: number;
	children: React.ReactNode;
};

type SearchBounds = {
	lower: number;
	upper: number;
	candidate: number;
};

const IS_SERVER = typeof window === "undefined";
const useIsomorphicLayoutEffect = IS_SERVER ? React.useEffect : useLayoutEffect;

function mergeStyles(...styles: Array<TextProps["style"] | undefined>) {
	return styles.filter(Boolean);
}

/**
 * A Native version of the react-wrap-balancer component.
 *
 * This follows the same basic idea as the web implementation:
 * measure the rendered text, then binary-search the smallest width that keeps
 * the original line count. No forwardRef is used.
 */
function Balancer({ children, asChild = false, ratio = 1, ...props }: BalancerProps) {
	// Measure the container first, then probe different text widths until we find
	// the smallest width that preserves the original number of lines.
	const [containerWidth, setContainerWidth] = useState(0);
	const [naturalLineCount, setNaturalLineCount] = useState<number | null>(null);
	const [bounds, setBounds] = useState<SearchBounds | null>(null);
	const [balancedWidth, setBalancedWidth] = useState<number | null>(null);

	const childElement = asChild && isValidElement(children) ? children : null;
	const canCloneChild = childElement !== null;
	const typedChildElement = childElement as React.ReactElement<any> | null;

	useIsomorphicLayoutEffect(() => {
		setNaturalLineCount(null);
		setBounds(null);
		setBalancedWidth(null);
	}, [children, ratio, asChild]);

	const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
		const nextWidth = Math.round(event.nativeEvent.layout.width);
		setContainerWidth((currentWidth) => (currentWidth === nextWidth ? currentWidth : nextWidth));
	}, []);

	const handleProbeTextLayout = useCallback(
		(event: { nativeEvent: { lines: Array<unknown> } }) => {
			if (containerWidth <= 0) return;

			const measuredLineCount = event.nativeEvent.lines.length;

			if (naturalLineCount === null) {
				setNaturalLineCount(measuredLineCount);

				if (measuredLineCount <= 1) {
					setBalancedWidth(containerWidth);
					return;
				}

				const lower = Math.max(containerWidth / 2, 1);
				const upper = Math.max(containerWidth, lower + 1);
				const candidate = Math.round((lower + upper) / 2);

				setBounds({ lower, upper, candidate });
				return;
			}

			if (!bounds) return;

			if (Math.abs(bounds.upper - bounds.lower) <= 1) {
				const finalWidth = Math.round(bounds.upper * ratio + containerWidth * (1 - ratio));
				setBalancedWidth(Math.max(1, finalWidth));
				return;
			}

			if (measuredLineCount > naturalLineCount) {
				const nextLower = Math.max(bounds.lower, bounds.candidate);
				if (nextLower === bounds.lower && nextLower === bounds.upper) {
					setBalancedWidth(Math.max(1, Math.round(bounds.upper * ratio + containerWidth * (1 - ratio))));
					return;
				}

				const nextCandidate = Math.round((nextLower + bounds.upper) / 2);
				setBounds({ lower: nextLower, upper: bounds.upper, candidate: nextCandidate });
				return;
			}

			const nextUpper = Math.min(bounds.upper, bounds.candidate);
			if (nextUpper === bounds.upper && nextUpper === bounds.lower) {
				setBalancedWidth(Math.max(1, Math.round(bounds.upper * ratio + containerWidth * (1 - ratio))));
				return;
			}

			const nextCandidate = Math.round((bounds.lower + nextUpper) / 2);
			setBounds({ lower: bounds.lower, upper: nextUpper, candidate: nextCandidate });
		},
		[containerWidth, naturalLineCount, bounds, ratio],
	);

	const visibleWidth = balancedWidth ?? (naturalLineCount !== null ? containerWidth : null);
	const probeWidth = bounds?.candidate ?? containerWidth;
	const shouldRenderProbe = containerWidth > 0 && balancedWidth === null;

	const visibleStyle = useMemo(() => {
		if (visibleWidth === null) return props.style;
		return mergeStyles(props.style, { maxWidth: visibleWidth });
	}, [props.style, visibleWidth]);

	const probeStyle = useMemo(() => {
		return mergeStyles(props.style, { maxWidth: probeWidth, opacity: 0, position: "absolute", left: -10000, top: -10000 });
	}, [props.style, probeWidth]);

	const renderVisibleContent = () => {
		if (canCloneChild && typedChildElement) {
			return React.cloneElement(typedChildElement, {
				...props,
				style: mergeStyles((typedChildElement.props as { style?: TextProps["style"] }).style, visibleStyle),
			});
		}

		return (
			<Text {...props} style={visibleStyle}>
				{children}
			</Text>
		);
	};

	const renderProbe = () => {
		if (canCloneChild && typedChildElement) {
			return React.cloneElement(typedChildElement, {
				...props,
				onTextLayout: handleProbeTextLayout,
				style: mergeStyles((typedChildElement.props as { style?: TextProps["style"] }).style, probeStyle),
				pointerEvents: "none",
				importantForAccessibility: "no-hide-descendants",
			});
		}

		return (
			<Text {...props} onTextLayout={handleProbeTextLayout} style={probeStyle} pointerEvents="none" importantForAccessibility="no-hide-descendants">
				{children}
			</Text>
		);
	};

	if (children == null) {
		return null;
	}

	return (
		<View onLayout={handleContainerLayout} style={{ width: "100%" }}>
			{shouldRenderProbe ? renderProbe() : null}
			{balancedWidth !== null ? renderVisibleContent() : null}
		</View>
	);
}

export { Balancer };

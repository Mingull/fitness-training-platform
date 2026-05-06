import { styled } from "nativewind";
import React from "react";
import { ViewStyle } from "react-native";
import Svg, {
	Circle,
	CircleProps,
	Ellipse,
	EllipseProps,
	G,
	GProps,
	Line,
	LineProps,
	Path,
	PathProps,
	Polygon,
	PolygonProps,
	Polyline,
	PolylineProps,
	Rect,
	RectProps,
	Text,
	TextProps,
} from "react-native-svg";

export type IconProps = {
	className?: string;
	size?: number | string;
	strokeWidth?: number;
	color?: string;
	style?: ViewStyle;
};

export type ElementName = "path" | "circle" | "rect" | "line" | "polygon" | "polyline" | "ellipse" | "g" | "text";

export type IconNode = [
	elementName: ElementName,
	props: (PathProps | CircleProps | RectProps | LineProps | PolygonProps | PolylineProps | EllipseProps | GProps | TextProps) & { key: string },
][];
export type Icon = (props: IconProps) => React.ReactNode;

export const createIcon = (name: string, node: IconNode, defaultProps?: IconProps): Icon => {
	return ({ size, color, className, style, ...rest }: IconProps) => {
		const hasColorClass = className?.match(/\b(text|bg)-\S+/);

		const combinedStyle: ViewStyle = {
			...style,
			// If the caller passed a Tailwind color class (e.g., text-...), let that win.
			// Otherwise only set an explicit color when the `color` prop is provided.
			...(hasColorClass ? {} : color ? { color } : {}),
		};

		return (
			<StyledSvg
				role="img"
				viewBox="0 0 24 24"
				width={size ?? defaultProps?.size ?? 24}
				height={size ?? defaultProps?.size ?? 24}
				fill="currentColor"
				className={className}
				style={combinedStyle}
				aria-label={name}
				{...rest}
			>
				{node.map(([type, props]) => {
					const { key, ...rest } = props;
					switch (type) {
						case "path":
							return <Path key={key} {...(rest as PathProps)} />;
						case "circle":
							return <Circle key={key} {...(rest as CircleProps)} />;
						case "rect":
							return <Rect key={key} {...(rest as RectProps)} />;
						case "line":
							return <Line key={key} {...(rest as LineProps)} />;
						case "polygon":
							return <Polygon key={key} {...(rest as PolygonProps)} />;
						case "polyline":
							return <Polyline key={key} {...(rest as PolylineProps)} />;
						case "ellipse":
							return <Ellipse key={key} {...(rest as EllipseProps)} />;
						case "g":
							return <G key={key} {...(rest as GProps)} />;
						case "text":
							return <Text key={key} {...(rest as TextProps)} />;
						default:
							return null;
					}
				})}
			</StyledSvg>
		);
	};
};

const StyledSvg = styled(Svg, {
	className: "style",
});

import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react-native";
import { styled } from "nativewind";
import { Platform, useColorScheme } from "react-native";
import { Toaster as Sonner, type ToasterProps } from "sonner-native";
import { Icon } from "./icon";

const StyledSonner = styled(Sonner, { className: "toastOptions.style" });

const Toaster = ({ ...props }: ToasterProps) => {
	const theme = useColorScheme();
	return (
		<StyledSonner
			theme={theme as ToasterProps["theme"]}
			icons={{
				success: <Icon as={CircleCheckIcon} className="size-10" />,
				info: <Icon as={InfoIcon} className="size-5" />,
				warning: <Icon as={TriangleAlertIcon} className="size-5" />,
				error: <Icon as={OctagonXIcon} className="size-5" />,
				loading: <Icon as={Loader2Icon} className="size-5 animate-spin" />,
			}}
			positionerStyle={Platform.OS === "android" ? { elevation: 999 } : undefined}
			toastOptions={{
				actionButtonStyle: {
					paddingHorizontal: 20,
				},
			}}
			className="bg-popover text-popover-foreground rounded-4xl border border-border"
			pauseWhenPageIsHidden
			{...props}
		/>
	);
};

export { Toaster };

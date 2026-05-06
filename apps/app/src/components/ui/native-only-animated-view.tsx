import { Platform } from "react-native";
import Animated from "react-native-reanimated";

/**
 * This component is used to wrap animated views that should only be animated on native.
 * @param props - The props for the animated view.
 * @returns The animated view if the platform is native, otherwise the children.
 * @example
 * <NativeOnlyAnimatedView entering={FadeIn} exiting={FadeOut}>
 *   <Text>I am only animated on native</Text>
 * </NativeOnlyAnimatedView>
 */
function NativeOnlyAnimatedView(
	props: Omit<React.ComponentProps<typeof Animated.View> & React.RefAttributes<typeof Animated.View>, "ref"> & { ref?: React.Ref<Animated.View> },
) {
	if (Platform.OS === "web") {
		return <>{props.children as React.ReactNode}</>;
	} else {
		const { ref, ...rest } = props;
		return <Animated.View ref={ref} {...rest} />;
	}
}

export { NativeOnlyAnimatedView };

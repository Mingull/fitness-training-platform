import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useSession } from "@/context/auth";
import { useProfile } from "@/hooks/use-profile";
import { useEffect } from "react";
import { View } from "react-native";

export default function Profile() {
	const { data, isLoading, error } = useProfile();
	const { refresh, signOut } = useSession();

	useEffect(() => {
		if (error?.statusCode === 401) {
			refresh();
		}
	}, [error, refresh]);

	return (
		<View className="bg-background flex-1 items-center justify-center">
			<Text className="text-primary text-xl font-bold">Your Profile</Text>

			{isLoading && <Text className="text-muted-foreground">Loading...</Text>}
			{error && <Text className="text-destructive mt-2">{error.message || "Failed to load profile."}</Text>}
			{data && (
				<View className="mt-4 items-center gap-2">
					<Text className="text-muted-foreground text-sm">{data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]}</Text>
					<Text className="text-foreground text-lg font-medium">{data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]}</Text>
					<Text className="text-foreground text-lg font-medium">{data["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]}</Text>
					<Button
						variant={"destructive"}
						onPress={() => {
							signOut();
						}}
					>
						<Text>Sign out</Text>
					</Button>
				</View>
			)}
		</View>
	);
}

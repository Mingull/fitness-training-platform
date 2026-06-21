import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { TrainerRequestItem } from "@fitness/contracts/trainer-requests";
import { View } from "react-native";

export const RequestItem = ({ item, onAccept, onReject }: { item: TrainerRequestItem; onAccept: () => void; onReject: () => void }) => {
	return (
		<Card>
			<CardHeader className="flex-row items-start justify-between gap-4">
				<View className="flex-col">
					<Text className="text-muted-foreground text-sm">@{item.sporter.username}</Text>
					<CardTitle>
						{item.sporter.firstName} {item.sporter.lastName}
					</CardTitle>
					{item.message && <CardDescription>{item.message}</CardDescription>}
				</View>
				<View className="h-full flex-row items-center justify-center gap-2">
					<Button onPress={onAccept}>
						<Text>Accept</Text>
					</Button>
					<Button variant="destructive" onPress={onReject}>
						<Text>Reject</Text>
					</Button>
				</View>
			</CardHeader>
		</Card>
	);
};

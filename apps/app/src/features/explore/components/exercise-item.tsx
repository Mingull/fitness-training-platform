import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ExerciseItem as ExerciseItemType } from "@fitness/contracts/exercises";

/**
 * Component to display an exercise item in the explore screen.
 * It is used for quickly adding exercises to a workout inside of a training plan.
 */
export const ExerciseItem = ({ item, orientation }: { item: ExerciseItemType; orientation: "horizontal" | "vertical" }) => {
	return (
		<Card className="py-4">
			<CardHeader className={orientation === "horizontal" ? "flex-col" : "flex-col"}>
				<CardTitle className="text-base font-semibold">{item.name}</CardTitle>
				<CardDescription numberOfLines={2} className="leading-5">
					{item.description}
				</CardDescription>
			</CardHeader>
		</Card>
	);
};

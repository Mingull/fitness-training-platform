import { Text, TextClassContext } from "@/components/ui/text";
import { cn } from "@fitness/ui/lib/utils";
import { Platform, View } from "react-native";

function Card({ className, ...props }: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
	return (
		<TextClassContext.Provider value="text-card-foreground text-sm">
			<View
				className={cn(
					"group/card bg-card flex flex-col gap-6 overflow-hidden rounded-4xl py-6 shadow-md has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 *:[img:first-child]:rounded-t-4xl *:[img:last-child]:rounded-b-4xl",
					Platform.select({
						web: "ring-foreground/5 dark:ring-foreground/10 ring-1",
					}),
					className,
				)}
				{...props}
			/>
		</TextClassContext.Provider>
	);
}

function CardHeader({ className, ...props }: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
	return (
		<View
			className={cn(
				"group/card-header @container/card-header gap-1.5 rounded-t-4xl px-6 group-data-[size=sm]/card:px-4 [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4",
				Platform.select({
					web: "grid auto-rows-min items-start has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
					native: "flex flex-col items-center has-data-[slot=card-action]:flex-row has-data-[slot=card-description]:flex-col",
				}),
				className,
			)}
			{...props}
		/>
	);
}

function CardTitle({ className, ref, ...props }: React.ComponentProps<typeof Text> & React.RefAttributes<typeof Text>) {
	return <Text data-slot="card-title" ref={ref} role="heading" aria-level={3} className={cn("font-heading text-base font-medium", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<typeof Text> & React.RefAttributes<typeof Text>) {
	return <Text data-slot="card-description" className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

function CardAction({ className, ...props }: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
	return (
		<View
			data-slot="card-action"
			className={cn(
				"self-start",
				Platform.select({
					web: "col-start-2 row-span-2 row-start-1 justify-self-end",
					native: "flex-row items-center",
				}),
				className,
			)}
			{...props}
		/>
	);
}

function CardContent({ className, ...props }: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
	return <View data-slot="card-content" className={cn("px-6 group-data-[size=sm]/card:px-4", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
	return (
		<View
			data-slot="card-footer"
			className={cn(
				"flex items-center rounded-b-4xl px-6 group-data-[size=sm]/card:px-4 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4",
				className,
			)}
			{...props}
		/>
	);
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };

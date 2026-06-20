import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Scaffold, ScaffoldContent, ScaffoldDescription, ScaffoldHeader, ScaffoldTitle } from "@/components/ui/scaffold";
import { Section, SectionGroup, SectionTitle } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { useSession } from "@/features/auth/context";
import { useExercises } from "@/features/exercises/hooks/use-exercises";
import { ExerciseItem } from "@/features/explore/components/exercise-item";
import { ExercisesEmptyState } from "@/features/explore/components/exercises-empty-state";
import { PlanItem } from "@/features/explore/components/plan-item";
import { PlansEmptyState } from "@/features/explore/components/plans-empty-state";
import { ProfileItem } from "@/features/explore/components/profile-item";
import { ProfilesEmptyState } from "@/features/explore/components/profiles-empty-state";
import { useTrainingPlans } from "@/features/plans/hooks/use-training-plans";
import { useProfiles } from "@/features/users/profile/hooks/use-profiles";
import { Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

type FilterOptions = "all" | "exercises" | "both" | "sporters" | "trainers" | "plans";

export default function ExploreScreen() {
	const [filter, setFilter] = useState<FilterOptions>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const session = useSession();

	const { data: profiles, isLoading: isLoadingProfiles, error: errorProfiles, isRefetching: isRefetchingProfiles, refetch: refetchProfiles } = useProfiles();
	const { data: plans, isLoading: isLoadingPlans, error: errorPlans, isRefetching: isRefetchingPlans, refetch: refetchPlans } = useTrainingPlans();
	const {
		data: exercises,
		isLoading: isLoadingExercises,
		error: errorExercises,
		isRefetching: isRefetchingExercises,
		refetch: refetchExercises,
	} = useExercises();

	const isRefreshing = isRefetchingProfiles || isRefetchingPlans || isRefetchingExercises;

	// search in profile can be by firstname, lastname, and username
	// if filter is "both", show both sporters and trainers, if filter is "sporters", show only sporters, if filter is "trainers", show only trainers
	// memoize the filtered profiles to avoid unnecessary re-renders
	const filteredProfiles = useMemo(() => {
		return (
			profiles?.filter((profile) => {
				const fullName = `${profile.firstName} ${profile.lastName}`.toLowerCase();
				const username = profile.username.toLowerCase();
				const matchesSearchQuery = fullName.includes(searchQuery.toLowerCase()) || username.includes(searchQuery.toLowerCase());
				if (filter === "both") return matchesSearchQuery;
				if (filter === "sporters") return matchesSearchQuery && profile.roles.includes("Sporter");
				if (filter === "trainers") return matchesSearchQuery && profile.roles.includes("Trainer");
				return matchesSearchQuery;
			}) ?? []
		);
	}, [profiles, searchQuery, filter]);
	// search in plans can be by name and description
	// memoize the filtered plans to avoid unnecessary re-renders
	const filteredPlans = useMemo(
		() =>
			plans?.filter(
				(plan) => plan.name.toLowerCase().includes(searchQuery.toLowerCase()) || plan.description.toLowerCase().includes(searchQuery.toLowerCase()),
			) ?? [],
		[plans, searchQuery],
	);
	// search in exercises can be by name and description
	// memoize the filtered exercises to avoid unnecessary re-renders
	const filteredExercises = useMemo(
		() =>
			exercises?.filter(
				(exercise) =>
					exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) || exercise.description.toLowerCase().includes(searchQuery.toLowerCase()),
			) ?? [],
		[exercises, searchQuery],
	);

	// count the total number of results based on the filtered lists and the current filter
	const resultCount = useMemo(() => {
		if (filter === "all") return filteredProfiles.length + filteredPlans.length + filteredExercises.length;
		if (filter === "both" || filter === "sporters" || filter === "trainers") return filteredProfiles.length;
		if (filter === "plans") return filteredPlans.length;
		if (filter === "exercises") return filteredExercises.length;
		return 0;
	}, [filter, filteredProfiles, filteredPlans, filteredExercises]);

	const handleRefresh = () => {
		refetchProfiles();
		refetchPlans();
		refetchExercises();
	};

	return (
		<Scaffold>
			<ScaffoldHeader>
				<View className="items-start justify-between gap-1">
					<ScaffoldTitle>Explore</ScaffoldTitle>
					<ScaffoldDescription>Discover new exercises and connect with other fitness enthusiasts and trainers</ScaffoldDescription>
				</View>
			</ScaffoldHeader>
			<ScaffoldContent
				className="flex-1"
				refreshControl={filter == "all" ? <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} /> : undefined}
			>
				<InputGroup>
					<InputGroupAddon>
						<Icon as={Search} />
					</InputGroupAddon>
					<InputGroupInput value={searchQuery} onChangeText={setSearchQuery} placeholder="Search..." />
					<InputGroupAddon align="inline-end">
						<Text>{resultCount} results</Text>
					</InputGroupAddon>
				</InputGroup>
				<ScrollView horizontal className="grow-0" contentContainerClassName="flex-row items-center gap-2" showsHorizontalScrollIndicator={false}>
					<Button className="will-change-variable" variant={filter === "all" ? "default" : "outline"} onPress={() => setFilter("all")}>
						<Text>All</Text>
					</Button>
					<View className="flex-row gap-0">
						<Button
							className="will-change-variable rounded-r-none border-r-0"
							variant={filter === "both" ? "default" : "outline"}
							onPress={() => setFilter("both")}
						>
							<Text>Both</Text>
						</Button>
						<Button
							className="will-change-variable rounded-none"
							variant={filter === "sporters" ? "default" : "outline"}
							onPress={() => setFilter("sporters")}
						>
							<Text>Sporters</Text>
						</Button>
						<Button
							className="will-change-variable rounded-l-none border-l-0"
							variant={filter === "trainers" ? "default" : "outline"}
							onPress={() => setFilter("trainers")}
						>
							<Text>Trainers</Text>
						</Button>
					</View>
					<Button className="will-change-variable" variant={filter === "plans" ? "default" : "outline"} onPress={() => setFilter("plans")}>
						<Text>Training Plans</Text>
					</Button>
					<Button className="will-change-variable" variant={filter === "exercises" ? "default" : "outline"} onPress={() => setFilter("exercises")}>
						<Text>Exercises</Text>
					</Button>
				</ScrollView>
				{filter === "all" && (
					<ScrollView className="flex-1" contentContainerClassName="grow-0 gap-6" showsVerticalScrollIndicator={false}>
						<SectionGroup>
							<Section>
								<SectionTitle>Sporters</SectionTitle>
								<FlatList
									data={filteredProfiles}
									keyExtractor={(item) => item.id}
									renderItem={({ item }) => <ProfileItem item={item} orientation="horizontal" />}
									contentContainerClassName="gap-4 h-full"
									ListEmptyComponent={<ProfilesEmptyState isLoading={isLoadingProfiles} error={errorProfiles} onRetry={refetchProfiles} />}
									horizontal
									showsHorizontalScrollIndicator={false}
								/>
							</Section>
							<Section>
								<SectionTitle>Training Plans</SectionTitle>
								<FlatList
									data={filteredPlans}
									keyExtractor={(item) => item.id}
									renderItem={({ item }) => <PlanItem item={item} authorId={session.userId} orientation="horizontal" />}
									contentContainerClassName="gap-4"
									ListEmptyComponent={<PlansEmptyState isLoading={isLoadingPlans} error={errorPlans} onRetry={refetchPlans} />}
									horizontal
									showsHorizontalScrollIndicator={false}
								/>
							</Section>
							<Section>
								<SectionTitle>Oefeningen</SectionTitle>
								<FlatList
									data={filteredExercises}
									keyExtractor={(item) => item.id}
									renderItem={({ item }) => <ExerciseItem item={item} orientation="horizontal" />}
									contentContainerClassName="gap-4"
									ListEmptyComponent={
										<ExercisesEmptyState isLoading={isLoadingExercises} error={errorExercises} onRetry={refetchExercises} />
									}
									horizontal
									showsHorizontalScrollIndicator={false}
								/>
							</Section>
						</SectionGroup>
					</ScrollView>
				)}
				{(filter === "both" || filter === "sporters" || filter === "trainers") && (
					<Section className="flex-1">
						<SectionTitle>
							{filter === "both" ?
								"Sporters and Trainers"
							: filter === "sporters" ?
								"Sporters"
							:	"Trainers"}
						</SectionTitle>
						<FlatList
							data={filteredProfiles}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => <ProfileItem item={item} orientation="vertical" />}
							refreshing={isRefetchingProfiles}
							onRefresh={refetchProfiles}
							className="flex-1"
							contentContainerClassName="gap-4 grow-0"
							ListEmptyComponent={<ProfilesEmptyState isLoading={isLoadingProfiles} error={errorProfiles} onRetry={refetchProfiles} />}
							showsVerticalScrollIndicator={false}
							nestedScrollEnabled
						/>
					</Section>
				)}
				{filter === "plans" && (
					<Section className="flex-1">
						<SectionTitle>Training plans</SectionTitle>
						<FlatList
							data={filteredPlans}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => <PlanItem item={item} orientation="vertical" />}
							refreshing={isRefetchingPlans}
							onRefresh={refetchPlans}
							className="flex-1"
							contentContainerClassName="gap-4 grow-0"
							ListEmptyComponent={<PlansEmptyState isLoading={isLoadingPlans} error={errorPlans} onRetry={refetchPlans} />}
							showsVerticalScrollIndicator={false}
							nestedScrollEnabled
						/>
					</Section>
				)}
				{filter === "exercises" && (
					<Section className="flex-1">
						<SectionTitle>Oefeningen</SectionTitle>
						<FlatList
							data={filteredExercises}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => <ExerciseItem item={item} orientation="vertical" />}
							refreshing={isRefetchingExercises}
							onRefresh={refetchExercises}
							className="flex-1"
							contentContainerClassName="gap-4 grow-0"
							ListEmptyComponent={<ExercisesEmptyState isLoading={isLoadingExercises} error={errorExercises} onRetry={refetchExercises} />}
							showsVerticalScrollIndicator={false}
							nestedScrollEnabled
						/>
					</Section>
				)}
			</ScaffoldContent>
		</Scaffold>
	);
}

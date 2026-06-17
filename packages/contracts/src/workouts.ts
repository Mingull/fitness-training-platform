import { z } from "zod";
import { apiResponseBaseContract } from "./api-response";
import { createExerciseContract, exerciseItemContract } from "./exercises";

/**
 * This is the base contract for a workout item that will be returned from the API.
 */
export const workoutItemContract = z.object({
	id: z.uuidv7(),
	name: z.string(),
	order: z.number(),
	createdAt: z.iso.datetime({ offset: true }),
	updatedAt: z.iso.datetime({ offset: true }).optional().nullable(),
	deletedAt: z.iso.datetime({ offset: true }).optional().nullable(),
});
/**
 * This is the TypeScript type for a workout item that will be returned from the API.
 */
export type WorkoutItem = z.infer<typeof workoutItemContract>;

/**
 * This is the contract for a single workout that will be returned from the API.
 */
export const workoutContract = apiResponseBaseContract.extend({
	data: workoutItemContract
		.extend({
			exercises: z.array(exerciseItemContract),
		})
		.omit({ order: true }), // as the order is not relevant for the workout detail response, we omit it here
});

/**
 * This is the TypeScript type for a workout that will be returned from the API.
 */
export type Workout = z.infer<typeof workoutContract>;

/**
 * This is the contract for a list of workouts that will be returned from the API.
 */
export const workoutListContract = apiResponseBaseContract.extend({
	data: z.array(workoutItemContract),
});

/**
 * This is the TypeScript type for a list of workouts that will be returned from the API.
 */
export type WorkoutList = z.infer<typeof workoutListContract>;

export const addExerciseToWorkoutContract = z.object({
	// Either the ID of an existing exercise or the data for a new exercise to be created and added to the workout.
	// The API will determine whether to create a new exercise or use an existing one based on whether the exerciseId is provided.
	exerciseId: z.uuidv7().optional(),
	exercise: createExerciseContract.optional(),
	sets: z.number().min(1),
	reps: z.number().min(1),
	weight: z.number().min(0),
});

export type AddExerciseToWorkout = z.infer<typeof addExerciseToWorkoutContract>;

export const reorderExercisesContract = z.array(
	z.object({
		exerciseId: z.uuidv7(),
		newOrderIndex: z.number(),
	}),
);

export type ReorderExercisesRequest = z.infer<typeof reorderExercisesContract>;

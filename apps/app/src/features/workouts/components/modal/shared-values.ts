import { createExerciseContract } from "@fitness/contracts/exercises";
import { addExerciseToWorkoutContract } from "@fitness/contracts/workouts";
import { formOptions } from "@tanstack/react-form";
import z from "zod";

const existingExerciseStep1Schema = z.object({
	source: z.literal("existing"),
	exerciseId: z.uuidv7("exerciseId.validations.required"),
	exercise: createExerciseContract.optional(),
});

const newExerciseStep1Schema = z.object({
	source: z.literal("new"),
	exerciseId: z.uuidv7().optional(),
	exercise: createExerciseContract,
});

export const step1Schema = z.discriminatedUnion("source", [existingExerciseStep1Schema, newExerciseStep1Schema]);

export const step2Schema = addExerciseToWorkoutContract.omit({
	exerciseId: true,
	exercise: true,
});

export const addExerciseFormOpts = formOptions({
	defaultValues: {
		step1: {
			source: "existing",
			exerciseId: "",
			exercise: undefined,
		} satisfies z.infer<typeof step1Schema> as z.infer<typeof step1Schema>,
		step2: {
			reps: 1,
			sets: 1,
			weight: 0,
		} satisfies z.infer<typeof step2Schema> as z.infer<typeof step2Schema>,
	},
});

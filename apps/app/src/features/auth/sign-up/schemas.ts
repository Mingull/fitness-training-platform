import { defineRequirements, requirementsToSchema } from "@fitness/ui/components/advanced-input";
import { z } from "zod";

export const passwordRequirements = defineRequirements(({ min, regex, noRepeats }) => [
	min(8, "Password must be at least 8 characters long"),
	regex(/[0-9]/, "Password must contain at least 1 number"),
	regex(/[a-z]/, "Password must contain at least 1 lowercase letter"),
	regex(/[A-Z]/, "Password must contain at least 1 uppercase letter"),
	regex(/[^a-zA-Z0-9]/, "Password must contain at least 1 special character"),
	noRepeats(3, "Password must not contain more than 3 repeating characters", ["hidden"]),
]);

export const stepOneScheme = z
	.object({
		email: z.email("Invalid email address").min(2, { error: "Email must be at least 2 characters long" }),
		password: requirementsToSchema(passwordRequirements),
		confirmPassword: z.string().min(8, { error: "Confirm password must be at least 8 characters long" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const stepTwoSchema = z.object({
	username: z.string().min(2, { error: "Username must be at least 2 characters long" }),
	firstname: z.string().min(2, { error: "First name must be at least 2 characters long" }),
	lastname: z.string().min(2, { error: "Last name must be at least 2 characters long" }),
});

export const stepThreeSchema = z.object({
	experienceLevel: z.string().optional(),
});

export const stepFourSchema = z.object({
	bio: z.string().optional(),
	goals: z.string().optional(),
	pictureUrl: z.string().optional(),
});

export const formSchema = z.object({
	stepOne: stepOneScheme,
	stepTwo: stepTwoSchema,
	stepThree: stepThreeSchema,
	stepFour: stepFourSchema,
});

export type FormSchema = z.infer<typeof formSchema>;

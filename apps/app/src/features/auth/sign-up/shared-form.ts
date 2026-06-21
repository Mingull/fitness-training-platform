import { formOptions } from "@tanstack/react-form";
import { z } from "zod";
import { stepFourSchema, stepOneSchema, stepThreeSchema, stepTwoSchema } from "./schemas";

export const sharedForm = formOptions({
	defaultValues: {
		stepOne: {
			email: "",
			password: "",
			confirmPassword: "",
		} satisfies z.infer<typeof stepOneSchema> as z.infer<typeof stepOneSchema>,
		stepTwo: {
			username: "",
			firstname: "",
			lastname: "",
		} satisfies z.infer<typeof stepTwoSchema> as z.infer<typeof stepTwoSchema>,
		stepThree: {
			experienceLevel: "",
		} satisfies z.infer<typeof stepThreeSchema> as z.infer<typeof stepThreeSchema>,
		stepFour: {
			bio: undefined,
			goals: undefined,
			pictureUrl: undefined,
		} satisfies z.infer<typeof stepFourSchema> as z.infer<typeof stepFourSchema>,
	},
	props: {
		className: "",
	},
});

type Primitive = string | number | boolean | bigint | symbol | null | undefined | Date;
export type FlattenRefName<T> =
	T extends Primitive ? never
	:	{
			[K in Extract<keyof T, string>]: T[K] extends Primitive | unknown[] ? `${K}` : `${K}` | `${K}.${FlattenRefName<T[K]>}`;
		}[Extract<keyof T, string>];

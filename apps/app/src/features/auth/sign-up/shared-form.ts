import { formOptions } from "@tanstack/react-form";
import { FormSchema } from "./schemas";

export const sharedForm = formOptions({
	defaultValues: {
		stepOne: {
			email: "",
			password: "",
			confirmPassword: "",
		},
		stepTwo: {
			username: "",
			firstname: "",
			lastname: "",
		},
		stepThree: {
			experienceLevel: "",
		},
		stepFour: {
			bio: undefined,
			goals: undefined,
			pictureUrl: undefined,
		},
	} satisfies FormSchema as FormSchema,
	props: {
		className: "",
	},
});
type Primitive = string | number | boolean | bigint | symbol | null | undefined | Date;
export type FlattenRefName<T> =
	T extends Primitive ? never
	:	{
			[K in Extract<keyof T, string>]: T[K] extends Primitive | Array<unknown> ? `${K}` : `${K}` | `${K}.${FlattenRefName<T[K]>}`;
		}[Extract<keyof T, string>];

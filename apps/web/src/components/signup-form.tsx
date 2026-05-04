"use client";

import { Link } from "@/i18n/navigation";
import { signUp } from "@/server/auth/sign-up";
import { DiscordIcon, GoogleIcon } from "@fitness/icons";
import { AdvancedInput, defineRequirements, requirementsToSchema } from "@fitness/ui/components/advanced-input";
import { Button } from "@fitness/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@fitness/ui/components/card";
import { FieldGroup, FieldSet } from "@fitness/ui/components/field";
import { FormBase } from "@fitness/ui/components/forms/base";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@fitness/ui/components/input-group";
import { useAppForm } from "@fitness/ui/hooks/forms";
import { cn } from "@fitness/ui/lib/utils";
import { Eye, EyeOff, GalleryVerticalEnd } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Balancer } from "react-wrap-balancer";
import { toast } from "sonner";
import { z } from "zod";

const passwordRequirements = defineRequirements(({ min, regex, noRepeats }) => [
	min(8, "Password must be at least 8 characters long"),
	regex(/[0-9]/, "Password must contain at least 1 numbers"),
	regex(/[a-z]/, "Password must contain at least 1 lowercase letters"),
	regex(/[A-Z]/, "Password must contain at least 1 uppercase letter"),
	regex(/[^a-zA-Z0-9]/, "Password must contain at least 1 special character"),
	noRepeats(3, "Password must not contain more than 3 repeating characters", ["hidden"]),
]);

const formSchema = z
	.object({
		firstname: z.string().min(2, { error: "First name must be at least 2 characters long" }),
		lastname: z.string().min(2, { error: "Last name must be at least 2 characters long" }),
		username: z.string().min(2, { error: "Username must be at least 2 characters long" }),
		email: z.email("Invalid email address").min(2, {
			error: "Email must be at least 2 characters long",
		}),
		password: requirementsToSchema(passwordRequirements),
		confirmPassword: z.string().min(8, { error: "Confirm password must be at least 8 characters long" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type FormData = z.infer<typeof formSchema>;

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
	const t = useTranslations("sign-up");
	const [errorMessage, setErrorMessage] = useState<string | null>(null); // global error message state
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

	const form = useAppForm({
		defaultValues: {
			firstname: "",
			lastname: "",
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		} satisfies FormData as FormData,
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			setErrorMessage(null);

			const { error } = await signUp({
				firstname: value.firstname,
				lastname: value.lastname,
				username: value.username,
				email: value.email,
				password: value.password,
			});

			if (error) {
				setErrorMessage(error.message || "Failed to sign up.");
				toast.error(error.message || "Failed to sign up.", { position: "top-center" });
				return;
			}

			form.reset();
			toast.success("Signed up successfully!", { position: "top-center" });
		},
	});
	const handleSignInProvider = async (provider: "google" | "discord") => {
		void provider;
		// await authClient.signIn.social({ provider, callbackURL: "/dashboard" });
	};
	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
			<Card className={cn("flex flex-col gap-6 backdrop-blur-md", className)} {...props}>
				<CardHeader>
					<div className="flex flex-col items-center gap-2">
						<a href="#" className="flex flex-col items-center gap-2 font-medium">
							<div className="flex size-8 items-center justify-center rounded-md">
								<GalleryVerticalEnd className="size-6" />
							</div>
							<span className="sr-only">Fitness Trainer Platform</span>
						</a>
						<CardTitle>{t("title", { title: "FTP" })}</CardTitle>
						<CardDescription>
							<Balancer>{t("subtitle", { title: "FTP" })}</Balancer>
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<div className="flex flex-col gap-4">
							{errorMessage ?
								<div className="text-center text-red-500">{errorMessage}</div>
							:	null}
							<FieldSet className="flex flex-col gap-4">
								<FieldGroup>
									<div className="flex flex-col gap-4 md:flex-row">
										<form.AppField name="firstname" validators={{ onBlur: formSchema.shape.firstname }}>
											{(field) => (
												<>
													<field.Input label="First Name" type="text" placeholder="Enter your first name" />
												</>
											)}
										</form.AppField>
										<form.AppField name="lastname" validators={{ onBlur: formSchema.shape.lastname }}>
											{(field) => (
												<>
													<field.Input label="Last Name" type="text" placeholder="Enter your last name" />
												</>
											)}
										</form.AppField>
									</div>
									<form.AppField name="username" validators={{ onBlur: formSchema.shape.username }}>
										{(field) => (
											<>
												<field.Input label="Username" type="text" placeholder="Enter your username" />
											</>
										)}
									</form.AppField>
									<form.AppField name="email" validators={{ onBlur: formSchema.shape.email }}>
										{(field) => (
											<>
												<field.Input label="Email" type="email" placeholder="Enter your email" />
											</>
										)}
									</form.AppField>
									<form.AppField name="password" validators={{ onBlur: formSchema.shape.password }}>
										{(field) => (
											<FormBase label="Password">
												{(isInvalid) => (
													<AdvancedInput
														id={field.name}
														name={field.name}
														value={field.state.value}
														onBlur={field.handleBlur}
														onChange={(e) => field.handleChange(e.target.value)}
														aria-invalid={isInvalid}
														type="password"
														placeholder="********"
														requirements={passwordRequirements}
														onStrengthChange={(strength) => {
															if (strength === 0) return { color: "bg-border", text: "Enter a password" };
															if (strength <= 1) return { color: "bg-red-500", text: "Very weak password" };
															if (strength <= 2) return { color: "bg-orange-500", text: "Weak password" };
															if (strength <= 3) return { color: "bg-amber-500", text: "Medium password" };
															if (strength <= 4) return { color: "bg-yellow-500", text: "Good password" };
															if (strength === 5) return { color: "bg-green-500", text: "Strong password" };
															return { color: "bg-emerald-500", text: "Strong password" };
														}}
													/>
												)}
											</FormBase>
										)}
									</form.AppField>
									<form.AppField name="confirmPassword" validators={{ onBlur: formSchema.shape.confirmPassword }}>
										{(field) => (
											<FormBase label="Confirm Password">
												{(isInvalid) => (
													<InputGroup>
														<InputGroupInput
															id={field.name}
															name={field.name}
															value={field.state.value}
															onBlur={field.handleBlur}
															onChange={(e) => field.handleChange(e.target.value)}
															aria-invalid={isInvalid}
															type={showPasswordConfirm ? "text" : "password"}
															placeholder="********"
														/>
														<InputGroupAddon align="inline-end">
															<InputGroupButton
																onClick={() => {
																	setShowPasswordConfirm((prev) => !prev);
																}}
																aria-label="Toggle password visibility"
															>
																{showPasswordConfirm ?
																	<EyeOff />
																:	<Eye />}
															</InputGroupButton>
														</InputGroupAddon>
													</InputGroup>
												)}
											</FormBase>
										)}
									</form.AppField>
								</FieldGroup>

								<Button type="submit" className="w-full" disabled={form.state.isSubmitting}>
									{form.state.isSubmitting ? "" : t("button")}
								</Button>
								<div className="text-center text-sm">
									{t("have-account")}{" "}
									<Link href="/sign-in" className="underline underline-offset-4">
										{t("linkText")}
									</Link>
								</div>
							</FieldSet>
							<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
								<span className="bg-card text-muted-foreground relative z-10 px-2">{t("divider")}</span>
							</div>
							<div className="grid gap-4 sm:grid-cols-2">
								<Button
									variant="outline"
									type="button"
									className="w-full"
									onClick={() => handleSignInProvider("google")}
									aria-label={t("continue", { provider: "Google" })}
								>
									<GoogleIcon className="text-foreground" />
									{t("continue", { provider: "Google" })}
								</Button>
								<Button
									variant="outline"
									type="button"
									className="w-full"
									onClick={() => handleSignInProvider("discord")}
									aria-label={t("continue", { provider: "Discord" })}
								>
									<DiscordIcon className="text-foreground" />
									{t("continue", { provider: "Discord" })}
								</Button>
							</div>
						</div>
					</form>
				</CardContent>
				<CardFooter>
					<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
						<Balancer>
							{t.rich("tos", {
								tos: (chunks) => (
									<Link href="/terms-of-service" className="underline">
										{chunks}
									</Link>
								),
								privacy: (chunks) => (
									<Link href="/privacy-policy" className="underline">
										{chunks}
									</Link>
								),
							})}
						</Balancer>
					</div>
				</CardFooter>
			</Card>
		</motion.div>
	);
}

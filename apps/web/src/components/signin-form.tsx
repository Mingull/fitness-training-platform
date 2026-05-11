"use client";

import { Link } from "@/i18n/navigation";
import { signIn } from "@/server/auth/sign-in";
import { DiscordIcon, GoogleIcon } from "@fitness/icons";
import { Button } from "@fitness/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fitness/ui/components/card";
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

const formSchema = z.object({
	email: z.string().min(2, {
		message: "Please enter your email",
	}),
	password: z.string().min(6, "Password must be at least 6 characters long"),
	remember: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function SignInForm({ className, ...props }: React.ComponentProps<"div">) {
	const t = useTranslations("sign-in");
	const [showPassword, setShowPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null); // global error message state

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
			remember: false,
		} satisfies FormData as FormData,
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			const { data, error } = await signIn({
				email: value.email,
				password: value.password,
				remember: value.remember,
			});

			if (!error) {
				form.reset();
				toast.success("Signed in successfully!");
				console.log({ data });
			} else {
				setErrorMessage(error.message || "Failed to sign in.");
				toast.error("Failed to sign in.");
				console.log({ error });
			}
		},
	});

	const handleSignInProvider = async (provider: "google" | "discord") => {
		// 	await authClient.signIn.social({ provider, callbackURL: "/dashboard" });
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
							<span className="sr-only">Minestater</span>
						</a>
						<CardTitle>{t("title", { title: "Minestater" })}</CardTitle>
						<CardDescription>
							<Balancer>{t("subtitle", { title: "Minestater" })}</Balancer>
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
									<form.AppField name="email">
										{(field) => (
											<>
												<field.Input label="Email" type="email" placeholder="Enter your email" />
											</>
										)}
									</form.AppField>
									<form.AppField name="password">
										{(field) => (
											<FormBase label="Password">
												{(isInvalid) => (
													<InputGroup>
														<InputGroupInput
															id={field.name}
															name={field.name}
															value={field.state.value}
															onBlur={field.handleBlur}
															onChange={(e) => field.handleChange(e.target.value)}
															aria-invalid={isInvalid}
															type={showPassword ? "text" : "password"}
															placeholder="********"
														/>
														<InputGroupAddon align="inline-end">
															<InputGroupButton
																onClick={() => {
																	setShowPassword((prev) => !prev);
																}}
																aria-label="Toggle password visibility"
															>
																{showPassword ?
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
								<FieldGroup aria-orientation="horizontal">
									<div className="flex items-center justify-between">
										<form.AppField name="remember">
											{(field) => (
												<>
													<field.Checkbox label={t("remember")} className="w-fit" />
												</>
											)}
										</form.AppField>
										<Link href="/forgot-password" className="text-sm underline underline-offset-4">
											{t("forgot")}
										</Link>
									</div>
								</FieldGroup>
								<Button type="submit" className="w-full" disabled={form.state.isSubmitting}>
									{form.state.isSubmitting ? "" : t("button")}
								</Button>
								<div className="text-center text-sm">
									{t("no-account")}{" "}
									<Link href="/sign-up" className="underline underline-offset-4">
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
			</Card>
		</motion.div>
	);
}

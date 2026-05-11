import { LanguageSelector } from "@/components/language-selector";
import { SignInForm } from "@/components/signin-form";
import { BackgroundBoxes } from "@fitness/ui/components/background-boxes";

export default function SignInPage() {
	return (
		<div className="bg-background relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="absolute top-4 right-4 z-20">
				<LanguageSelector />
			</div>
			<div className="relative z-10 w-full max-w-md">
				<SignInForm />
			</div>
			{/* Here comes background if possible */}
			<BackgroundBoxes cell={48} />
		</div>
	);
}

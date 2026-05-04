import { BackgroundBoxes } from "@fitness/ui/components/background-boxes";
import { LanguageSelector } from "@/components/language-selector";
import { SignupForm } from "@/components/signup-form";

export default function SignUpPage() {
	return (
		<div className="bg-background relative flex min-h-dvh flex-col items-center justify-center p-0 md:gap-6 md:p-10">
			<div className="absolute top-4 right-4 z-20">
				<LanguageSelector />
			</div>
			<div className="relative z-10 w-full max-w-md">
				<SignupForm />
			</div>
			{/* Here comes background if possible */}
			<BackgroundBoxes cell={48} />
		</div>
	);
}

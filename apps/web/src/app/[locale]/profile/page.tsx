import { getProfile } from "@/server/profile/me";

export default async function ProfilePage({ params }: PageProps<"/[locale]/profile">) {
	const { locale } = await params;
	const result = await getProfile(locale);

	return (
		<div>
			<h1>Profile</h1>
			{result.error ?
				<p>Error: {result.error.message}</p>
			:	<p>Welcome, {result.data?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]}!</p>}
		</div>
	);
}

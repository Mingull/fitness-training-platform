import { FieldSet } from "@/components/ui/field";
import { withForm } from "@/hooks/forms";
import { cn } from "@fitness/ui/lib/utils";
import { useTranslations } from "use-intl";
import { sharedForm } from "../../shared-form";

export const StepFour = withForm({
	...sharedForm,
	render: function Render({ form, className }) {
		const t = useTranslations("sign-up.steps.stepFour");

		return (
			<FieldSet className={cn("gap-4", className)}>
				<form.AppField name="stepFour.bio">
					{(field) => (
						<field.Textarea label={t("inputs.bio.label")} description={t("inputs.bio.description")} placeholder={t("inputs.bio.placeholder")} />
					)}
				</form.AppField>

				<form.AppField name="stepFour.goals">
					{(field) => (
						<field.Textarea
							label={t("inputs.goals.label")}
							description={t("inputs.goals.description")}
							placeholder={t("inputs.goals.placeholder")}
						/>
					)}
				</form.AppField>

				{/* Profile picture: allow picking or taking a photo */}
				{/* <form.AppField name="stepFour.pictureUrl">
					{(field) => {
						const [localUri, setLocalUri] = useState<string | null>(field.state.value ?? null);
						useEffect(() => {
							setLocalUri(field.state.value ?? null);
						}, [field.state.value]);

						const pickImage = async () => {
							const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
							if (status !== "granted") return;
							const result = await ImagePicker.launchImageLibraryAsync({
								mediaTypes: ImagePicker.MediaTypeOptions.Images,
								allowsEditing: true,
								quality: 0.7,
							});
							if (!result.canceled && result.assets?.[0]?.uri) {
								const uri = result.assets[0].uri;
								setLocalUri(uri);
								field.handleChange(uri);
							}
						};

						const takePhoto = async () => {
							const { status } = await ImagePicker.requestCameraPermissionsAsync();
							if (status !== "granted") return;
							const result = await ImagePicker.launchCameraAsync({
								mediaTypes: ImagePicker.MediaTypeOptions.Images,
								allowsEditing: true,
								quality: 0.7,
							});
							if (!result.canceled && result.assets?.[0]?.uri) {
								const uri = result.assets[0].uri;
								setLocalUri(uri);
								field.handleChange(uri);
							}
						};

						return (
							<View className="space-y-2">
								<Text className={cn("text-muted-foreground text-sm")}>Profile Picture (optional)</Text>
								{localUri ?
									<Image source={{ uri: localUri }} className="h-24 w-24 rounded-full" />
								:	<View className="bg-border h-24 w-24 items-center justify-center rounded-full">
										<Text className="text-muted-foreground text-xs">No photo</Text>
									</View>
								}
								<View className="flex-row gap-2">
									<TouchableOpacity onPress={pickImage} className="bg-border rounded px-3 py-2">
										<Text>Select Photo</Text>
									</TouchableOpacity>
									{Platform.OS !== "web" && (
										<TouchableOpacity onPress={takePhoto} className="bg-border rounded px-3 py-2">
											<Text>Take Photo</Text>
										</TouchableOpacity>
									)}
								</View>
							</View>
						);
					}}
				</form.AppField> */}
			</FieldSet>
		);
	},
});

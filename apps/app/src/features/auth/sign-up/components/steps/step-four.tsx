import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Text } from "@/components/ui/text";
import { withForm } from "@/hooks/forms";
import { cn } from "@fitness/ui/lib/utils";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Platform, View } from "react-native";
import { useTranslations } from "use-intl";
import { sharedForm } from "../../shared-form";

export const StepFour = withForm({
	...sharedForm,
	render: function Render({ form, className }) {
		const t = useTranslations("auth.signUp.steps.about");
		const [previewUri, setPreviewUri] = useState<string | null>(null);

		const toDataUri = (asset: ImagePicker.ImagePickerAsset) => {
			if (!asset.base64) return null;
			const mimeType = asset.mimeType ?? "image/jpeg";
			return `data:${mimeType};base64,${asset.base64}`;
		};

		return (
			<FieldGroup className={cn("gap-4", className)}>
				<form.AppField name="stepFour.bio">
					{(field) => (
						<field.Textarea
							label={t("form.fields.bio.label")}
							description={t("form.fields.bio.description")}
							placeholder={t("form.fields.bio.placeholder")}
						/>
					)}
				</form.AppField>

				<form.AppField name="stepFour.goals">
					{(field) => (
						<field.Textarea
							label={t("form.fields.goals.label")}
							description={t("form.fields.goals.description")}
							placeholder={t("form.fields.goals.placeholder")}
						/>
					)}
				</form.AppField>

				{/* Profile picture: allow picking or taking a photo */}
				<form.AppField name="stepFour.pictureUrl">
					{(field) => {
						const localUri = previewUri ?? (field.state.value?.startsWith("data:") ? field.state.value : null);

						const pickImage = async () => {
							const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
							if (status !== "granted") return;
							const result = await ImagePicker.launchImageLibraryAsync({
								mediaTypes: ["images"],
								allowsEditing: true,
								aspect: [1, 1],
								base64: true,
								quality: 0.7,
							});
							if (!result.canceled && result.assets?.[0]) {
								const asset = result.assets[0];
								const imageDataUri = toDataUri(asset);
								if (!imageDataUri) return;

								setPreviewUri(asset.uri);
								field.handleChange(imageDataUri);
							}
						};

						const takePhoto = async () => {
							const { status } = await ImagePicker.requestCameraPermissionsAsync();
							if (status !== "granted") return;
							const result = await ImagePicker.launchCameraAsync({
								mediaTypes: ["images"],
								allowsEditing: true,
								aspect: [1, 1],
								base64: true,
								quality: 0.7,
							});
							if (!result.canceled && result.assets?.[0]) {
								const asset = result.assets[0];
								const imageDataUri = toDataUri(asset);
								if (!imageDataUri) return;

								setPreviewUri(asset.uri);
								field.handleChange(imageDataUri);
							}
						};

						return (
							<View className="space-y-2">
								<Text className={cn("text-muted-foreground text-sm")}>Profile Picture (optional)</Text>
								{localUri ?
									<Avatar alt="Profile Picture" className="border-background size-48 rounded-3xl">
										<AvatarImage source={{ uri: localUri }} className="size-48 rounded-md" />
										<AvatarFallback className="bg-border size-48 items-center justify-center rounded-md">
											<Text className="text-muted-foreground text-xs">Preview</Text>
										</AvatarFallback>
									</Avatar>
								:	<View className="bg-border size-48 items-center justify-center rounded-md">
										<Text className="text-muted-foreground text-xs">No photo</Text>
									</View>
								}
								<View className="flex-row gap-2">
									<Button onPress={pickImage} className="bg-border rounded px-3 py-2">
										<Text>Select Photo</Text>
									</Button>
									{Platform.OS !== "web" && (
										<Button onPress={takePhoto} className="bg-border rounded px-3 py-2">
											<Text>Take Photo</Text>
										</Button>
									)}
								</View>
							</View>
						);
					}}
				</form.AppField>
			</FieldGroup>
		);
	},
});

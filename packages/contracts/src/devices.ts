import { z } from "zod";
import { apiResponseBaseContract } from "./api-response";

/**
 * This is the base contract for a device item that will be returned from the API.
 */
export const deviceItemContract = z.object({
	id: z.uuidv7(),
	expoToken: z.string(),
	platform: z.enum(["ios", "android", "web"]),
	isActive: z.boolean(),
	lastActiveAt: z.iso.datetime({ offset: true }),
	createdAt: z.iso.datetime({ offset: true }),
	updatedAt: z.iso.datetime({ offset: true }).optional().nullable(),
});
/**
 * This is the TypeScript type for a device item that will be returned from the API.
 */
export type DeviceItem = z.infer<typeof deviceItemContract>;

/**
 * This is the contract for a single device that will be returned from the API.
 */
export const deviceContract = apiResponseBaseContract.extend({
	data: deviceItemContract,
});

/**
 * This is the TypeScript type for a device that will be returned from the API.
 */
export type Device = z.infer<typeof deviceContract>;

/**
 * This is the contract for registering a device for push notifications. It includes the Expo push token and the platform of the device.
 */
export const registerDeviceContract = z.object({
	expoToken: z.string(),
	platform: z.enum(["ios", "android", "web"]),
});

/**
 * This is the TypeScript type for registering a device for push notifications.
 */
export type RegisterDevice = z.infer<typeof registerDeviceContract>;

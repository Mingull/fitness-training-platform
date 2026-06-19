// this file includes the contracts for notifications
import { z } from "zod";
import { apiResponseBaseContract } from "./api-response";

/**
 * This is the base contract for a notification item that will be returned from the API.
 */
export const notificationItemContract = z.object({
	id: z.uuidv7(),
	title: z.string(),
	message: z.string(),
	type: z.string(),
	metadata: z.string().nullable().optional(),
	readAt: z.iso.datetime({ offset: true }).nullable().optional(),
	createdAt: z.iso.datetime({ offset: true }),
	updatedAt: z.iso.datetime({ offset: true }).optional().nullable(),
});
/**
 * This is the TypeScript type for a notification item that will be returned from the API.
 */
export type NotificationItem = z.infer<typeof notificationItemContract>;

/**
 * This is the contract for a single notification that will be returned from the API.
 */
export const notificationContract = apiResponseBaseContract.extend({
	data: notificationItemContract,
});

/**
 * This is the TypeScript type for a notification that will be returned from the API.
 */
export type Notification = z.infer<typeof notificationContract>;

/**
 * This is the contract for a list of notifications that will be returned from the API.
 */
export const notificationListContract = apiResponseBaseContract.extend({
	data: z.array(notificationItemContract),
});

/**
 * This is the TypeScript type for a list of notifications that will be returned from the API.
 */
export type NotificationList = z.infer<typeof notificationListContract>;


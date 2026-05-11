import { z } from "zod";

export type Route = {
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	path: string;
	requiresAuth?: boolean;
	in?: z.ZodType;
	out: z.ZodType;
};

export type RouteNamespace = {
	[key: string]: Route | RouteNamespace;
};

export type RequestOptions<R extends Route> = {
	headers?: Record<string, string>;
	timeout?: number;
	signal?: AbortSignal;
} & (R["requiresAuth"] extends true ? { accessToken: string | undefined } : { accessToken?: never });

export type ClientErrorCode = "missing_token" | "input_validation" | "network" | "http" | "output_validation" | "unknown";

export type ClientError = {
	code: ClientErrorCode;
	message: string;
	statusCode?: number;
	details?: unknown;
};

export type ClientResult<TData> = { data: TData; error: null } | { data: null; error: ClientError };

export type InputOf<R extends Route> = NonNullable<R["in"]> extends z.ZodType ? z.input<NonNullable<R["in"]>> : never;

export type OutputOf<R extends Route> = z.output<R["out"]>;

export type ArgsOf<R extends Route> = NonNullable<R["in"]> extends z.ZodType ? [data: InputOf<R>, options?: RequestOptions<R>] : [options?: RequestOptions<R>];

export type Client<T extends RouteNamespace> = {
	[K in keyof T]: T[K] extends Route ? (...args: ArgsOf<T[K]>) => Promise<ClientResult<OutputOf<T[K]>>>
	: T[K] extends RouteNamespace ? Client<T[K]>
	: never;
};

import { z } from "zod";

/**
 * This type defines the shape of fetch function that can be used in the API client.
 * It takes a URL and an optional RequestInit object, and returns a Promise that resolves to a Response.
 * This allows for flexibility in using different fetch implementations, such as the built-in fetch in browsers or custom implementations in other environments.
 */
export type FetchFn = (url: string, init?: RequestInit | undefined) => Promise<Response>;

/**
 * This type defines the structure of a Route in the API client.
 */
export type Route = {
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	path: string;
	auth?: "required" | "optional";
	in?: z.ZodType;
	out: z.ZodType;
};

/**
 * This type defines the structure of a RouteNamespace, which is a recursive type that can contain either Route objects or nested RouteNamespaces.
 * This allows for organizing routes in a hierarchical manner, for example grouping all user-related routes under a "users" namespace.
 */
export type RouteNamespace = {
	[key: string]: Route | RouteNamespace;
};

/**
 * This type defines the options that can be passed when creating an API client.
 * It includes the base URL for the API, the route definitions, an optional error schema for validating error responses, an optional custom fetch function, and a default timeout for requests.
 */
export type RequestOptions<R extends Route> = {
	headers?: Record<string, string>;
	timeout?: number;
	signal?: AbortSignal;
	$fetch?: FetchFn;
} & (R["auth"] extends "required" ? { accessToken: string | undefined }
: R["auth"] extends "optional" ? { accessToken?: string | undefined }
: { accessToken?: never }) &
	(IsParamPath<R["path"]> extends true ? { params: InferPath<R["path"]> } : { params?: never });

/**
 * This is a TypeScript type that uses conditional types and template literal types to determine if a given path string contains parameter placeholders.
 * It checks if the path matches the pattern of having curly braces with some content inside, which indicates that it is a parameterized path.
 * If the path contains parameters, it returns true; otherwise, it returns false.
 */
type IsParamPath<Path extends string> = Path extends `${string}{${string}}${string}` ? true : false;

/**
 * This is a TypeScript type that recursively infers the parameter names and types from a route path string.
 * It uses template literal types to extract the parameter names and their optional type annotations from the path string.
 * For example, a path like "/plans/{id}" would result in an inferred type of { id: string }, while a path like "/plans/{id:number}" would result in { id: number }.
 * This allows for strong typing of route parameters when defining API routes and using the generated client methods.
 */
type InferPath<Path extends string, Acc extends string = never, Obj extends Record<string, unknown> = {}> =
	Path extends `${string}{${infer Param}}${infer Rest}` ?
		InferPath<
			Rest,
			Acc | Param,
			Obj & (Param extends `${infer Key}:${infer Type}` ? { [K in Key]: Type extends "number" ? number : string } : { [K in Param]: string })
		>
	:	Obj;

/**
 * This type defines the structure of an error object that can be returned by the API client.
 * It includes a code that categorizes the type of error, a message describing the error, an optional HTTP status code, and optional additional details about the error.
 * This standardized error format allows for consistent error handling across different API routes and operations.
 */
export type ClientErrorCode = "missing_token" | "input_validation" | "network" | "http" | "output_validation" | "unknown";

/**
 * This type defines the structure of an error object that can be returned by the API client.
 * It includes a code that categorizes the type of error, a message describing the error, an optional HTTP status code, and optional additional details about the error.
 * This standardized error format allows for consistent error handling across different API routes and operations.
 */
export type ClientError = {
	code: ClientErrorCode;
	message: string;
	statusCode?: number;
	details?: unknown;
};

/**
 * This type defines the structure of the result returned by the API client methods.
 * It is a discriminated union type that can either be a successful result containing the expected data, or an error result containing a ClientError object.
 * This allows for consistent handling of both successful responses and errors when using the API client methods.
 */
export type ClientResult<TData> = { data: TData; error: null } | { data: null; error: ClientError };

export type InputOf<R extends Route> = NonNullable<R["in"]> extends z.ZodType ? z.input<NonNullable<R["in"]>> : never;

export type OutputOf<R extends Route> = z.output<R["out"]>;

export type ArgsOf<R extends Route> = NonNullable<R["in"]> extends z.ZodType ? [data: InputOf<R>, options?: RequestOptions<R>] : [options?: RequestOptions<R>];

export type Client<T extends RouteNamespace> = {
	[K in keyof T]: T[K] extends Route ? (...args: ArgsOf<T[K]>) => Promise<ClientResult<OutputOf<T[K]>>>
	: T[K] extends RouteNamespace ? Client<T[K]>
	: never;
};

import { z } from "zod";
import { ArgsOf, Client, ClientError, ClientResult, FetchFn, InputOf, OutputOf, RequestOptions, Route, RouteNamespace } from "./types";

/**
 * Check if the given value is a Route config object by verifying that it has the required properties (method, path, out).
 * This is used to differentiate between Route configs and nested RouteNamespaces when building the client object.
 */
const isRouteConfig = (value: RouteNamespace | Route): value is Route => {
	return typeof value === "object" && value !== null && "method" in value && "path" in value && "out" in value;
};
/**
 * Check if the given error is an AbortError, which indicates that a fetch request was aborted, either due to a timeout or an explicit abort signal.
 * This is used to differentiate between different types of errors for more accurate error handling in the API client.
 */
const isAbortError = (error: unknown): error is Error => {
	return error instanceof Error && error.name === "AbortError";
};
/**
 * Check if the given path string contains parameter placeholders, for example "/plans/{id}" or "/plans/{id:number}" would return true, while "/plans" would return false.
 */
const isParameterizedPath = (path: string): boolean => {
	return /\{[^}]+\}/.test(path);
};

export type ApiClientOptions<R extends RouteNamespace> = {
	baseUrl: string;
	routes: R;
	errorSchema?: z.ZodType;
	$fetch?: FetchFn;
	defaultTimeout?: number;
};
/**
 * Create an API client based on the provided route definitions and configuration.
 * The generated client will have methods corresponding to each route, which handle making HTTP requests, validating input and output, and error handling according to the route definitions.
 */
export const createApiClient = <const R extends RouteNamespace>({
	baseUrl,
	routes,
	errorSchema,
	$fetch,
	defaultTimeout = 10_000,
}: ApiClientOptions<R>): Client<R> => {
	const asClientError = (error: unknown): ClientError => {
		if (error instanceof Error) {
			return {
				code: "unknown",
				message: error.message,
				details: error,
			};
		}

		return {
			code: "unknown",
			message: "Unknown error",
			details: error,
		};
	};

	/**
	 * Build the URL path by replacing parameter placeholders with actual values from the params object.
	 * @example buildPath("/plans/{id}", { id: 123 }) => "/plans/123"
	 */
	const buildPath = (path: string, params?: Record<string, unknown> | undefined): string => {
		if (!params) throw new Error("Missing path params");
		const entries = Object.entries(params);

		return path.replace(/\{([^}]+)\}/g, (_match, paramExpr: string) => {
			const key = paramExpr.split(":")[0];
			const found = entries.find(([k]) => k === key);
			const val = found ? found[1] : undefined;
			if (val === undefined || val === null) {
				throw new Error(`Missing path param: ${key}`);
			}
			return encodeURIComponent(String(val));
		});
	};

	/**
	 * Execute the HTTP request for a given route config, input data, and request options.
	 * This function is responsible for constructing the URL, setting headers (including auth), validating input, making the fetch call, handling timeouts and aborts, and validating output according to the route definition.
	 */
	const executeRequest = async <T extends Route>(
		config: T,
		data: InputOf<T> | undefined,
		options?: RequestOptions<T>,
		accessToken?: string,
	): Promise<ClientResult<OutputOf<T>>> => {
		let resolvedPath = config.path;
		if (isParameterizedPath(config.path)) {
			try {
				resolvedPath = buildPath(config.path, (options as any)?.params);
			} catch (err) {
				return {
					data: null,
					error: {
						code: "input_validation",
						message: err instanceof Error ? err.message : "Missing or invalid path params",
						details: err,
					},
				};
			}
		}

		const url = new URL(resolvedPath, baseUrl);

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			...options?.headers,
		};

		if ((config.auth === "required" || config.auth === "optional") && accessToken) {
			headers.Authorization = `Bearer ${accessToken}`;
		}

		let body: string | undefined;
		if (config.in && data !== undefined) {
			const parsedInput = config.in.safeParse(data);
			if (!parsedInput.success) {
				return {
					data: null,
					error: {
						code: "input_validation",
						message: "Request payload validation failed",
						details: parsedInput.error,
					},
				};
			}
			body = JSON.stringify(parsedInput.data);
		}

		let controller: AbortController | undefined;
		let timeoutId: ReturnType<typeof setTimeout> | undefined;
		const effectiveTimeoutMs = options?.timeout ?? defaultTimeout;
		let didTimeout = false;
		if (!options?.signal && effectiveTimeoutMs != null) {
			controller = new AbortController();
			timeoutId = setTimeout(() => {
				didTimeout = true;
				controller!.abort();
			}, effectiveTimeoutMs);
		}
		const finalSignal = options?.signal ?? controller?.signal;

		try {
			const requestFetch = options?.$fetch ?? $fetch ?? globalThis.fetch;
			if (requestFetch == null) {
				throw new Error("Fetch API is not available in this environment. Please provide a custom $fetch implementation.");
			}
			const response = await requestFetch(url.toString(), {
				method: config.method,
				headers,
				body,
				signal: finalSignal,
				credentials: "include",
			});

			const contentType = (response.headers.get("content-type") || "").toLowerCase();
			const isJson = contentType.startsWith("application/json") || contentType.includes("+json");
			const responseBody = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null);

			if (!response.ok) {
				let parsedErrorDetails: unknown = responseBody;
				if (isJson && errorSchema) {
					const parsedErr = errorSchema.safeParse(responseBody);
					if (parsedErr.success) parsedErrorDetails = parsedErr.data;
				}

				const message = (() => {
					if (typeof parsedErrorDetails === "object" && parsedErrorDetails !== null) {
						if ("detail" in parsedErrorDetails && typeof (parsedErrorDetails as Record<string, unknown>).detail === "string") {
							return (parsedErrorDetails as Record<string, unknown>).detail as string;
						}
						if ("message" in parsedErrorDetails && typeof (parsedErrorDetails as Record<string, unknown>).message === "string") {
							return (parsedErrorDetails as Record<string, unknown>).message as string;
						}
					}
					return `Request failed with status ${response.status}`;
				})();

				return {
					data: null,
					error: {
						code: "http",
						message,
						statusCode: response.status,
						details: parsedErrorDetails,
					},
				};
			}

			const parsedOutput = config.out.safeParse(responseBody);
			if (!parsedOutput.success) {
				return {
					data: null,
					error: {
						code: "output_validation",
						message: "Response validation failed",
						details: parsedOutput.error,
					},
				};
			}

			return {
				data: parsedOutput.data as OutputOf<T>,
				error: null,
			};
		} catch (error) {
			if (isAbortError(error)) {
				return {
					data: null,
					error: {
						code: "network",
						message: didTimeout ? `Request timed out after ${effectiveTimeoutMs}ms` : "Request was aborted",
						details: error,
					},
				};
			}

			if (error instanceof TypeError) {
				return {
					data: null,
					error: {
						code: "network",
						message: error.message,
						details: error,
					},
				};
			}

			return {
				data: null,
				error: asClientError(error),
			};
		} finally {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		}
	};
	/**
	 * Make an API request based on the route config, input data, and request options.
	 * This function handles authentication, input validation, making the HTTP request, and output validation according to the route definition.
	 */
	const request = async <T extends Route>(config: T, data: InputOf<T> | undefined, options?: RequestOptions<T>): Promise<ClientResult<OutputOf<T>>> => {
		if ((config.auth === "required" || config.auth === "optional") && !options?.accessToken) {
			return {
				data: null,
				error: {
					code: "missing_token",
					message: "Access token required but not provided",
					statusCode: 401,
				},
			};
		}

		return executeRequest(config, data, options, options?.accessToken);
	};

	/**
	 * Create a route handler function for a given route config.
	 * The handler will take care of validating input, making the HTTP request, and validating output according to the route definition.
	 */
	const createRouteHandler = <C extends Route>(route: C) => {
		type RouteArgs = ArgsOf<C>;
		type RouteOutput = ClientResult<OutputOf<C>>;

		if (route.in) {
			const fn = async (...args: RouteArgs): Promise<RouteOutput> => {
				const [data, options] = args as [InputOf<C>, RequestOptions<C> | undefined];
				return request(route, data, options);
			};
			return fn;
		}

		const fn = async (...args: RouteArgs): Promise<RouteOutput> => {
			const [options] = args as [RequestOptions<C> | undefined];
			return request<C>(route, undefined, options);
		};
		return fn;
	};

	/**
	 * Recursively build the client object by traversing the route namespace tree and creating handler functions for each route config.
	 */
	const builder = (branch: RouteNamespace): any => {
		const result: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(branch) as [string, Route | RouteNamespace][]) {
			if (isRouteConfig(value)) {
				result[key] = createRouteHandler(value);
			} else {
				result[key] = builder(value);
			}
		}
		return result;
	};

	return builder(routes) as Client<R>;
};

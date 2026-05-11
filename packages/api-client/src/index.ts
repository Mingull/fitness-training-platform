import { z } from "zod";
import { ArgsOf, Client, ClientError, ClientResult, InputOf, OutputOf, RequestOptions, Route, RouteNamespace } from "./types";

const isRouteConfig = (value: RouteNamespace | Route): value is Route => {
	return typeof value === "object" && value !== null && "method" in value && "path" in value && "out" in value;
};

export type ApiClientOptions<R extends RouteNamespace> = {
	baseUrl: string;
	routes: R;
	errorSchema?: z.ZodType;
};

export const createApiClient = <const R extends RouteNamespace>({ baseUrl, routes, errorSchema }: ApiClientOptions<R>): Client<R> => {
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

	const executeRequest = async <T extends Route>(
		config: T,
		data: InputOf<T> | undefined,
		options?: RequestOptions<T>,
		accessToken?: string,
	): Promise<ClientResult<OutputOf<T>>> => {
		const url = new URL(config.path, baseUrl);

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			...options?.headers,
		};

		if (config.requiresAuth === true && accessToken) {
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
		if (!options?.signal && options?.timeout != null) {
			controller = new AbortController();
			timeoutId = setTimeout(() => controller!.abort(), options.timeout);
		}
		const finalSignal = options?.signal ?? controller?.signal;

		try {
			const response = await fetch(url, {
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

			if (error instanceof DOMException && error.name === "AbortError") {
				return {
					data: null,
					error: {
						code: "network",
						message: "Request timeout or aborted",
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

	const request = async <T extends Route>(config: T, data: InputOf<T> | undefined, options?: RequestOptions<T>): Promise<ClientResult<OutputOf<T>>> => {
		if (config.requiresAuth === true && !options?.accessToken) {
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

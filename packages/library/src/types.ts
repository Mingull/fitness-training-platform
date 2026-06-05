/**
 * Prettify a type by flattening its properties, making it easier to read in IDEs and error messages
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};
/**
 * Exclude a type from a union type
 */
export type BetterExclude<T, K extends T> = Exclude<T, K>;
/**
 * Omit a type from an object type
 */
export type BetterOmit<T, K extends keyof T> = Omit<T, K>;
/**
 * Loosely enforce a string literal type while still allowing any string (useful for autocomplete in IDEs)
 */
export type AutoComplete<T extends string> = T | (string & {});
/**
 * Brand a type with a unique identifier to create a nominal type
 */
export type Branded<T, B> = T & { __brand: B };

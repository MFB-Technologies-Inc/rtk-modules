/**
 * Some basic functional programming utilities that are used
 * internally in this package.
 */
/**
 *  Forward-compose up to five functions
 */
export declare function pipe<A, B, C, D, E, F>(f: (a: A) => B, g: (b: B) => C, h?: (c: C) => D, i?: (d: D) => E, j?: (e: E) => F): ((x: A) => F) | ((x: A) => E) | ((x: A) => D) | ((x: A) => C);
/**
 *  Right compose up to five functions
 */
export declare function compose<A, B, C, D, E, F>(j: (e: E) => F, i: (d: D) => E, h?: (c: C) => D, g?: (b: B) => C, f?: (a: A) => B): ((x: A) => F) | ((x: B) => F) | ((x: C) => F) | ((x: D) => F);
/**
 * Forward compose functions type functions, i.e., functions that
 * transform a value to another value of the same type
 */
export declare const merge: <A>(...fs: Array<(a: A) => A>) => (a: A) => A;
/**
 * two layer higher function to transfer a single record property
 */
export declare const prop: <T extends Record<string, any>>() => <TKey extends keyof T>(k: TKey) => (v: T[TKey]) => (t: T) => T;
/**
 * two layer higher function to create a setter for the first item of an array
 */
export declare const first: <T>() => (f: (t: T) => T) => (arr: T[]) => T[];
/**
 * two layer higher function to create a setter for the last item of an array
 */
export declare const last: <T>() => (f: (t: T) => T) => (arr: T[]) => T[];

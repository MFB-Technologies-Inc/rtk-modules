/**
 * Some basic functional programming utilities that are used
 * internally in this package.
 */

/**
 *  Forward-compose up to five functions
 */
export function pipe<A, B, C, D, E, F>(
  f: (a: A) => B,
  g: (b: B) => C,
  h?: (c: C) => D,
  i?: (d: D) => E,
  j?: (e: E) => F
) {
  if (h) {
    if (i) {
      if (j) {
        return (x: A) => j(i(h(g(f(x)))))
      }
      return (x: A) => i(h(g(f(x))))
    }
    return (x: A) => h(g(f(x)))
  }
  return (x: A) => g(f(x))
}

/**
 *  Right compose up to five functions
 */
export function compose<A, B, C, D, E, F>(
  j: (e: E) => F,
  i: (d: D) => E,
  h?: (c: C) => D,
  g?: (b: B) => C,
  f?: (a: A) => B
) {
  if (h) {
    if (g) {
      if (f) {
        return (x: A) => j(i(h(g(f(x)))))
      }
      return (x: B) => j(i(h(g(x))))
    }
    return (x: C) => j(i(h(x)))
  }
  return (x: D) => j(i(x))
}

/**
 * Forward compose functions type functions, i.e., functions that
 * transform a value to another value of the same type
 */
export const merge: <A>(...fs: Array<(a: A) => A>) => (a: A) => A = (...fs) => {
  return x => fs.reduceRight((acc, f) => f(acc), x)
}

/**
 * two layer higher function to transfer a single record property
 */
export const prop: <T extends Record<string, any>>() => <TKey extends keyof T>(
  k: TKey
) => (v: T[TKey]) => (t: T) => T = () => k => v => t => {
  const newT = { ...t }
  newT[k] = v
  return newT
}

/**
 * two layer higher function to create a setter for the first item of an array
 */
export const first: <T>() => (f: (t: T) => T) => (arr: T[]) => T[] =
  () => f => arr => {
    const newArr = [...arr]
    newArr[0] = f(arr[0])
    return newArr
  }

/**
 * two layer higher function to create a setter for the last item of an array
 */
export const last: <T>() => (f: (t: T) => T) => (arr: T[]) => T[] =
  () => f => arr => {
    const newArr = [...arr]
    newArr[arr.length - 1] = f(arr[arr.length - 1])
    return newArr
  }

export type ImmediateOrPromise<T> = T | Promise<T>;

export type SingleOrArray<T> = T | readonly T[];

export function ensureArray<T>(potentialArray: SingleOrArray<T>): readonly T[] {
  return potentialArray instanceof Array ? potentialArray : [potentialArray];
}

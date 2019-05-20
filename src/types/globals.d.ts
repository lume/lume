type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
type Constructor<T = any, A extends any[] = any[]> = new (...a: A) => T

// `Id` is an identity type, but it is also used as a trick to expand the
// type given to it so that tooltips show the basic type rather then all the
// conditional/aliases used.
type Id<T> = {} & {[P in keyof T]: T[P]}

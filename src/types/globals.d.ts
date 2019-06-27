type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
type Constructor<T = any, A extends any[] = any[]> = new (...a: A) => T

// `Id` is an identity type, but it is also used as a trick to expand the
// type given to it so that tooltips show the basic type rather then all the
// conditional/aliases used.
type Id<T> = {} & {[P in keyof T]: T[P]}

// TODO regexr types
declare module 'regexr' {
    export default any
}

declare module '@awaitbox/document-ready' {
    export default function documentReady(): Promise<void>
}

declare module 'army-knife/forLength' {
    export default function forLength(count: number, fn: (n: number) => void): void
}

declare module 'autolayout'
declare module 'james-bond'

declare module 'element-behaviors' {
    class ElementBehaviors {
        define(name: string, Class: Constructor): void
    }
    declare global {
        const elementBehaviors: ElementBehaviors
    }
}

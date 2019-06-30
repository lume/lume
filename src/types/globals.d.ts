type Constructor<T = object, A extends any[] = any[]> = new (...a: A) => T

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

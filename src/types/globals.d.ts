// TODO regexr types
declare module 'regexr'

declare module '@awaitbox/document-ready' {
    export default function documentReady(): Promise<void>
}

declare module 'army-knife/forLength' {
    export default function forLength(count: number, fn: (n: number) => void): void
}

declare module 'autolayout'
declare module 'james-bond'
declare module 'jss'
declare module 'army-knife'
declare module 'army-knife/callAfter'
declare module 'tween.js'

declare module 'element-behaviors' {
    import {Constructor} from 'lowclass'

    class ElementBehaviors {
        define(name: string, Class: Constructor): void
    }

    global {
        const elementBehaviors: ElementBehaviors
    }
}

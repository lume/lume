// TODO regexr types
declare module 'regexr'

declare module '@awaitbox/document-ready' {
	export default function documentReady(): Promise<void>
}

// TODO add types to army-knife (and re-name it to something more peaceful)
declare module 'army-knife/forLength.js' {
	export default function forLength(count: number, fn: (n: number) => void): void
}

declare module 'autolayout'
declare module 'james-bond'
declare module 'at-at' // TODO
declare module 'jsdoctypeparser'

import {createEffect, createSignal, getOwner, onCleanup} from 'solid-js'

/**
 * Returns a signal with the latest mutations for a given target and options.
 */
export function nodeMutations(target: Node, options: MutationObserverInit) {
	if (!getOwner()) throw new Error('mutations() must be used inside a reactive context.')

	const [mutations, setMutations] = createSignal<MutationRecord[]>([])
	const observer = new MutationObserver(setMutations)

	observer.observe(target, options)
	onCleanup(() => observer.disconnect())

	return mutations
}

/**
 * Returns a signal with an HTMLCollection of an element's children. When
 * element's children change, the signal is triggered with the same
 * HTMLCollection, in the next microtask after children have changed.
 */
export function elementChildren(element: Element) {
	const mutations = nodeMutations(element, {childList: true})
	const [children, setChildren] = createSignal(element.children, {equals: false})

	createEffect(() => {
		mutations()
		setChildren(element.children)
	})

	return children
}

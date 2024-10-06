// const addedTo = new Map<Node, Node>()
// const removedFrom = new Map<Node, Node>()
// let scheduled = false

// TODO no any
export interface ObserveChildrenOptions {
	/** The target element to observe children on. */
	target: Element | ShadowRoot | Document
	/** Called when a child is added to `target`. */
	onConnect: (this: Element, child: Element) => void
	/** Called when a child is removed from `target`. */
	onDisconnect: (this: Element, child: Element) => void
	/**
	 * By default onConnect and onDisconnect are called only for elements, not
	 * text nodes or comment nodes. Set to `true` to include text nodes and
	 * comment nodes.
	 *
	 * Default: `false`
	 */
	includeTextNodes?: boolean
	/**
	 * If `true`, onConnect and onDisconnect will only be called based on the
	 * child's final position, and any intermediate mutation records will be ignored. For
	 * example, this means that if a child is disconnected and then immediately
	 * (synchronously) connected back to the same parent, onDisconnect and
	 * onConnect (respectively) will not be called because the final result is
	 * that the element did not move and is still connected to the same parent, therefore there is nothing to do.
	 *
	 * Similarly, if a child was moved around to several parents synchronously
	 * and ends up at a different parent than the original, onDisconnect and
	 * onConnect will be called only once each, in that order, and they will not
	 * be called for every intermediate parent because the end result is that
	 * the child moved from one parent to another. This avoids doing extra unnecessary work.
	 *
	 * If `false`, then onConnect and onDisconnect are called for every mutation
	 * record, for example if a child is disconnected and reconnected
	 * synchronously to the same parent the onDisconnect and onConnect will fire
	 * in that order, or if a child moved to several parents then onDisconnect
	 * and onConnect will be called for each parent.
	 *
	 * Default: `false`
	 */
	weighted?: boolean
}

export function observeChildren({
	target,
	onConnect,
	onDisconnect,
	includeTextNodes = false,
	weighted = false,
}: ObserveChildrenOptions) {
	const childObserver = createChildObserver(onConnect, onDisconnect, includeTextNodes, weighted)
	childObserver.observe(target, {childList: true})
	return () => childObserver.disconnect()
}

/**
 * NOTE: If a child is synchronously disconnected then connected to the same parent in the
 * same tick when weighted is true, then the onConnect and onDisconnect callbacks won't be called
 * because the DOM tree will be back in the exact state as before (this is
 * possible thanks to the logic associated with weightsPerTarget).
 */
export function createChildObserver(onConnect: any, onDisconnect: any, includeTextNodes = false, weighted = false) {
	const observer = new MutationObserver(changes => {
		if (!weighted) {
			for (const change of changes) {
				const {target, removedNodes, addedNodes} = change

				for (let i = 0, l = removedNodes.length; i < l; i += 1) onDisconnect.call(target, removedNodes[i])
				for (let i = 0, l = addedNodes.length; i < l; i += 1) onConnect.call(target, addedNodes[i])
			}

			return
		}

		const weightsPerTarget = new Map<any, Map<any, any>>()

		// We're just counting how many times each child node was added and
		// removed from the parent we're observing.
		for (let i = 0, l = changes.length; i < l; i += 1) {
			const change = changes[i]!

			if (change.type != 'childList') continue

			let weights = weightsPerTarget.get(change.target)

			if (!weights) weightsPerTarget.set(change.target, (weights = new Map()))

			const {addedNodes} = change
			for (let l = addedNodes.length, i = 0; i < l; i += 1) {
				const child = addedNodes[i]
				weights.set(child, (weights.get(child) || 0) + 1)
			}

			const {removedNodes} = change
			for (let l = removedNodes.length, i = 0; i < l; i += 1) {
				const child = removedNodes[i]
				weights.set(child, (weights.get(child) || 0) - 1)
			}
		}

		// The order of added and removed callbacks is wrong: it fires connected
		// before disconnected when a node was moved synchronously.
		// https://github.com/whatwg/dom/issues/1105
		for (const [target, weights] of Array.from(weightsPerTarget)) {
			for (const [child, weight] of Array.from(weights)) {
				if (!includeTextNodes && (child instanceof Text || child instanceof Comment)) continue

				// If the number of times a child was added is greater than the
				// number of times it was removed, then the net result is that
				// it was added, so we call onConnect just once.
				if (weight > 0 && typeof onConnect == 'function') {
					onConnect.call(target, child)
					// addedTo.set(child, target)
				}

				// If the number of times a child was added is less than the
				// number of times it was removed, then the net result is that
				// it was removed, so we call onDisconnect just once.
				else if (weight < 0 && typeof onDisconnect == 'function') {
					onDisconnect.call(target, child)
					// removedFrom.set(child, target)
				}

				// If the number of times a child was added is equal to the
				// number of times it was removed, then it was essentially left
				// in place, so we don't call anything.
			}
		}
	})

	return observer
}

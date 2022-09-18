// const addedTo = new Map<Node, Node>()
// const removedFrom = new Map<Node, Node>()
// let scheduled = false

// TODO no any
export interface ObserveChildrenOptions {
	target: any
	onConnect: any
	onDisconnect: any
	skipTextNodes: any
}

export function observeChildren({target, onConnect, onDisconnect, skipTextNodes}: ObserveChildrenOptions) {
	const childObserver = createChildObserver(onConnect, onDisconnect, skipTextNodes)
	childObserver.observe(target, {childList: true})
	return () => childObserver.disconnect()
}

// NOTE: If a child is disconnected then connected to the same parent in the
// same turn, then the onConnect and onDisconnect callbacks won't be called
// because the DOM tree will be back in the exact state as before (this is
// possible thanks to the logic associated with weightsPerTarget).

export function createChildObserver(onConnect: any, onDisconnect: any, skipTextNodes = false) {
	const observer = new MutationObserver(changes => {
		const weightsPerTarget = new Map<any, Map<any, any>>()

		// We're just counting how many times each child node was added and
		// removed from the parent we're observing.
		for (let i = 0, l = changes.length; i < l; i += 1) {
			const change = changes[i]

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
				if (skipTextNodes && (child instanceof Text || child instanceof Comment)) continue

				// If the number of times a child was added is greater than the
				// number of times it was removed, then the net result is that
				// it was added, so we call onConnect just once.
				if (weight > 0 && typeof onConnect == 'function') {
					console.log(' - Child Observer, child connected', target.id, child.id)
					onConnect.call(target, child)
					// addedTo.set(child, target)
				}

				// If the number of times a child was added is less than the
				// number of times it was removed, then the net result is that
				// it was removed, so we call onDisconnect just once.
				else if (weight < 0 && typeof onDisconnect == 'function') {
					console.log(' - Child Observer, child disconnected', target.id, child.id)
					onDisconnect.call(target, child)
					// removedFrom.set(child, target)
				}

				// If the number of times a child was added is equal to the
				// number of times it was removed, then it was essentially left
				// in place, so we don't call anything.
			}
		}

		// if (!scheduled) {
		// 	scheduled = true
		// 	queueMicrotask(() => {
		// 		scheduled = false

		// 		const changes = observer.takeRecords()

		// 		// It changes happened during the MO, we're not done yet, wait for more MOs.
		// 		// if (changes.length) return

		// 		const allNodes = new Set([...addedTo.keys(), ...removedFrom.keys()])

		// 		for (const child of allNodes) {
		// 			if (child.parentElement) { }
		// 		}

		// 		addedTo.clear()
		// 		removedFrom.clear()
		// 	})
		// }
	})

	return observer
}

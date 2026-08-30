import {createEffect, createSignal} from 'solid-js'
import {elementChildren} from '../utils/dom.js'
import {BehaviorEl} from './Behavior.js'
import {MaterialBehaviorEl} from './mesh-behaviors/materials/MaterialBehaviorEl.js'

/**
 * Returns a signal that updates with the child behaviors of the given element,
 * excluding any elements in `skip`.
 */
export function behaviorChildren(element: Element, ...skip: Element[]) {
	// CONTINUE:
	// TODO TODO we need a composedElementChildren helper, as this will not detect
	// flat tree children (f.e. children composed via <slot> elements). For now,
	// behaviors need to be direct children for this to work.
	// Once we have this, update the mount-point.html example to use that
	// instead of traverseComposed
	const children = elementChildren(element)
	const [behaviors, setBehaviors] = createSignal<BehaviorEl[]>([])

	createEffect(() => {
		const newBehaviors: BehaviorEl[] = []
		for (const el of children()) if (!skip.includes(el) && el instanceof BehaviorEl) newBehaviors.push(el)
		setBehaviors(newBehaviors)
	})

	return behaviors
}

/**
 * Returns a signal that updates with the child MaterialBehavior behaviors of
 * the given element, excluding any elements in `skip`.
 */
export function materialBehaviorChildren(element: Element, ...skip: Element[]) {
	const behaviors = behaviorChildren(element, ...skip)
	return () => behaviors().filter(b => b instanceof MaterialBehaviorEl) as MaterialBehaviorEl[]
}

import {createEffect, createSignal} from 'solid-js'
import {elementChildren} from '../utils/dom.js'
import {Behavior} from './Behavior.js'
import {MaterialBehavior} from './mesh-behaviors/materials/MaterialBehavior.js'

/**
 * Returns a signal that updates with the child behaviors of the given element,
 * excluding any elements in `skip`.
 */
export function behaviorElements(element: Element, ...skip: Element[]) {
	const children = elementChildren(element)
	const [behaviors, setBehaviors] = createSignal<Behavior[]>([])

	createEffect(() => {
		const newBehaviors: Behavior[] = []
		for (const el of children()) if (!skip.includes(el) && el instanceof Behavior) newBehaviors.push(el)
		setBehaviors(newBehaviors)
	})

	return behaviors
}

/**
 * Returns a signal that updates with the child MaterialBehavior behaviors of the
 * given element, excluding any elements in `skip`.
 */
export function materialBehaviorElements(element: Element, ...skip: Element[]) {
	const behaviors = behaviorElements(element, ...skip)
	return () => behaviors().filter(b => b instanceof MaterialBehavior) as MaterialBehavior[]
}

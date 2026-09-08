import {attribute, element, Element} from '@lume/element'
import {effect} from 'classy-solid'
import {Color} from 'three/src/math/Color.js'
import {AnyConstructor} from 'lowclass/dist/Constructor.js'
import type {TColor} from '../utils/three.js'

const isInstance = Symbol()

interface PossiblyNeedsUpdate {
	needsUpdate?(): void
}

interface ColorfulOptions {
	path?: string | string[]
	failOnNonObject?: boolean
}

/**
 * @class Colorful - This mixin class provides a `color` attribute and JS
 * property that maps to a Three.js sub-object with a color. This allow re-use
 * of a color attribute implementation and reactivity to avoid repetition.
 *
 * The Base class passed in must extend (i.e. this mixin is for use only on
 * classes that extend) from @lume/element's Element base class (the default if
 * no Base is specified), as this mixin relies on features for implementation.
 */
// CONTINUE ^ I think the requirement for base class to be Element no longer
// holds, @element() can be used on any element class, f.e. HTMLElement, or
// even non-element classes (the attribute part won't do anything then). Verify
// and remove requirement.
export function Colorful<T extends AnyConstructor>(
	Base: T = Element as any,
	{path = '.three.color', failOnNonObject = false}: ColorfulOptions = {},
) {
	if (Base.prototype instanceof Colorful)
		throw new Error('Base class already extends Colorful, no need to apply the mixin again.')

	if (!(Base.prototype instanceof Element))
		throw new Error("Base class must extend from @lume/element's Element class.")

	const path_ = typeof path === 'string' ? path.split('.').filter(s => !!s) : path

	class Colorful_ extends Base {
		// Use `any` to prevent subclass "has or is using private name" errors.
		get [isInstance as any]() {
			return true
		}

		/**
		 * @property {string | number | THREE.Color | [number, number, number]} color -
		 *
		 * `attribute`
		 *
		 * Default: `"white"`
		 *
		 * The color this element has.
		 *
		 * A string value can be any valid CSS color string, f.e. `"#ff6600"` or
		 * `"rgb(10,20,30)"`.
		 *
		 * A number value should represent a hex color value, f.e. `0xff6600`.
		 *
		 * A tuple of three numbers represents a color as RGB with each value
		 * between 0 and 1.
		 *
		 * A `THREE.Color` instance can be assigned, and it will replace any
		 * pre-existing Color value upon assignment. Mutating the assigned
		 * `THREE.Color` after assignment is non-reactive and will not update
		 * rendering; assign the same value again to trigger reactivity to
		 * update rendering, like so:
		 *
		 * ```js
		 * el.color.set('blue') // not reactive, does not update rendering
		 * el.color = el.color // trigger update to re-render
		 * ```
		 *
		 * Setting a value other than a `THREE.Color` will update any underlying
		 * `THREE.Color` object without re-creating it (only creating it
		 * initially if it doesn't exist).
		 */
		@attribute color: TColor = 'white'

		@effect colorEffect() {
			console.log('colorful effect')
			const color = this.color

			// If a new Color object is provided, override the old value.
			if (typeof color === 'object' && !Array.isArray(color)) setPath(this as any, path_, color, failOnNonObject)
			// Otherwise .set the value onto the existing underlying Color (create it if it doesn't exist).
			else {
				const normalized = Array.isArray(color) ? color : ([color] as const)
				const existingColor = getPath(this as any, path_, failOnNonObject) as any as Color | null
				if (!existingColor) setPath(this as any, path_, new Color(...normalized), failOnNonObject)
				else existingColor.set(...normalized)
			}

			;(this as PossiblyNeedsUpdate).needsUpdate?.()
		}
	}

	// Hack to pass through correct class type without the element decorator
	// causing "has or is using private name" errors when used as a decorator
	// inside a mixin class. We can't fix this in TypeScript without removing
	// `protected` and `private` key words from the Element class in
	// `@lume/element`.
	const Class = element({autoDefine: false})(Colorful_ as any)
	return Class as typeof Colorful_ // pass the expected class type through.
}

function setPath(obj: Record<PropertyKey, unknown>, path: string[], value: unknown, failOnNonObject = false) {
	for (const key of path) {
		if (fail(obj, failOnNonObject)) return
		// If last key in path set the value
		if (key === path[path.length - 1]) obj[key] = value
		else obj = obj[key] as any
	}
}

function getPath(obj: Record<PropertyKey, unknown>, path: string[], failOnNonObject = false) {
	for (const key of path) {
		if (fail(obj, failOnNonObject)) return
		obj = obj[key] as any
	}
	return obj
}

function fail(obj: any, failOnNonObject: boolean) {
	if (typeof obj !== 'object' || !obj) {
		if (failOnNonObject) throw new TypeError('Intermediary value in path not an object.')
		else return true
	}
	return false
}

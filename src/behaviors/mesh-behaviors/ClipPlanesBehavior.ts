import {createEffect} from 'solid-js'
import {stringAttribute, reactive, booleanAttribute} from '../attribute.js'
import {ClipPlane} from '../../core/ClipPlane.js'
import {MeshBehavior} from './MeshBehavior.js'
import type {MaterialBehavior} from './index.js'

export type ClipPlanesBehaviorAttributes =
	| 'clipPlanes'
	| 'clipIntersection'
	| 'clipShadows'
	| 'flipClip'
	| 'clipDisabled'

let refCount = 0

/**
 * @class ClipPlanesBehavior
 *
 * When applied to an element with GL content, allows specifying one or more
 * [`<lume-clip-plane>`](../../core/ClipPlane) elements to clip the content with.
 *
 * This class extends from `MeshBehavior`, enforcing that the behavior can be used
 * only on elements that have a geometry and material.
 *
 * <div id="clipPlaneExample"></div>
 *
 * <script type="application/javascript">
 *   new Vue({ el: '#clipPlaneExample', data: { code: clipPlaneExample }, template: '<live-code :template="code" mode="html>iframe" :debounce="200" />' })
 * </script>
 *
 * @extends MeshBehavior
 */
@reactive
export class ClipPlanesBehavior extends MeshBehavior {
	/**
	 * @property {boolean} clipIntersection
	 *
	 * `attribute`
	 *
	 * Default: 'false'
	 *
	 * Changes the behavior of clipping planes so that only their intersection
	 * is clipped, rather than their union.
	 */
	@booleanAttribute(false) clipIntersection = false

	/**
	 * @property {boolean} clipShadows
	 *
	 * `attribute`
	 *
	 * Default: `false`
	 *
	 * Defines whether to clip shadows
	 * according to the clipping planes specified on this material. Default is
	 * false.
	 */
	@booleanAttribute(true) clipShadows = true

	// TODO reactive array?
	#clipPlanes: Array<ClipPlane> = []
	#rawClipPlanes: string | Array<ClipPlane | string> = []

	/**
	 * @property {string | Array<ClipPlane | string | null>} clipPlanes
	 *
	 * *attribute*
	 *
	 * Default: `[]`
	 *
	 * The `clip-planes` attribute accepts one or more selectors, comma
	 * separated, that define which [`<lume-clip-plane>`](../../core/ClipPlane)
	 * elements are to be used as clip planes. If a selector matches an element
	 * that is not a `<lume-clip-plane>`, it is ignored. If a selector matches
	 * more than one element, all of them that are clip planes are used.
	 *
	 * ```html
	 * <lume-box has="clip-planes" clip-planes=".foo, .bar, #baz"></lume-box>
	 * ```
	 *
	 * The property can also be set with a string (comma separated selectors),
	 * or a mixed array of strings (selectors) or `<lume-clip-plane>` element
	 * instances.
	 *
	 * ```js
	 * el.clipPlanes = ".some-plane"
	 * // or
	 * const plane = document.querySelector('.some-clip-plane')
	 * el.clipPlanes = [plane, "#someOtherPlane"]
	 * ```
	 *
	 * The property getter returns the currently applicable collection of
	 * `<lume-clip-plane>` instances, not the original string or array of values
	 * passed into the attribute or setter. Applicable planes are those that are
	 * connected into the document, and that participate in rendering (composed,
	 * either in the top level document, in a ShadowRoot, or distributed to a
	 * slot in a ShadowRoot).
	 */
	@stringAttribute('')
	get clipPlanes(): Array<ClipPlane> {
		return this.#clipPlanes
	}
	set clipPlanes(value: string | Array<ClipPlane | string>) {
		this.#rawClipPlanes = value

		let array: Array<ClipPlane | string> = []

		if (typeof value === 'string') {
			array = [value.trim()]
		} else if (Array.isArray(value)) {
			array = value
		} else {
			throw new TypeError('Invalid value for clipPlanes')
		}

		this.#clipPlanes = []

		for (const v of array) {
			if (typeof v !== 'string') {
				if (v instanceof ClipPlane && v.scene) this.#clipPlanes.push(v)
				continue
			} else if (!v) {
				// skip empty strings, they cause an error with querySelector
				continue
			}

			let root = this.element.getRootNode() as Document | ShadowRoot | null

			// TODO Should we not search up the composed tree, and stay only
			// in the current ShadowRoot?

			while (root) {
				const els = root.querySelectorAll(v)

				for (let i = 0, l = els.length; i < l; i += 1) {
					const el = els.item(i) as Element | null

					if (!el) continue

					// Find only planes participating in rendering (i.e. in the
					// composed tree, noting that .scene is null when not
					// composed)
					if (el instanceof ClipPlane && el.scene) this.#clipPlanes.push(el)

					// TODO check the target is in the same scene
					// TODO We aren't observing el.scene, so if the element
					// becomes a particpant in the scene later nothing will
					// happen.
					// TODO If an element was not yet upgraded, it will not
					// be found here. We need to wait for upgrade.
					// TODO We need to also react to added/removed elements.
				}

				root = root instanceof ShadowRoot ? (root.host.getRootNode() as Document | ShadowRoot) : null
			}
		}
	}

	/**
	 * @property {boolean} flipClip
	 *
	 * *attribute*
	 *
	 * Default: `false`
	 *
	 * By default, the side of a plane that is clipped is in its positive Z
	 * direction. Setting this to `true` will reverse clipping to the other
	 * side.
	 */
	@booleanAttribute(false) flipClip = false

	/**
	 * @property {boolean} clipDisabled
	 *
	 * *attribute*
	 *
	 * Default: `false`
	 *
	 * If `true`, clipping is not applied.
	 */
	@booleanAttribute(false) clipDisabled = false

	/**
	 * `reactive`
	 */
	get material() {
		const mat = this.element.behaviors.find(name => name.endsWith('-material')) as MaterialBehavior | null
		return mat?.meshComponent ?? null
	}

	#observer: MutationObserver | null = null

	override loadGL() {
		this.createEffect(() => {
			if (!this.element.scene) return

			if (!refCount) this.element.scene.__localClipping = true
			refCount++

			// loadGL may fire during parsing before children exist. This
			// MutationObserver will also fire during parsing. This allows us to
			// re-run the query logic whenever DOM in the current root changes.
			//
			// TODO we need to observe all the way up the composed tree, or we
			// should make the querying scoped only to the nearest root, for
			// consistency. This covers most cases, for now.
			this.#observer = new MutationObserver(() => {
				// TODO this could be more efficient if we check the added nodes directly, but for now we re-run the query logic.
				// This triggers the setter logic.
				this.clipPlanes = this.#rawClipPlanes
			})

			this.#observer.observe(this.element.getRootNode(), {childList: true, subtree: true})

			createEffect(() => {
				const {clipPlanes, clipIntersection, clipShadows, flipClip} = this

				const mat = this.material
				if (!mat) return

				this.element.needsUpdate()

				if (!clipPlanes.length || this.clipDisabled) {
					mat.clippingPlanes = null

					// FIXME upstream: don't forget this or Three.js has a bug that
					// still attempts to perform clipping even if clippingPlanes is
					// null. https://github.com/munrocket/three.js/pull/5
					mat.clipShadows = false

					return
				}

				if (!mat.clippingPlanes) mat.clippingPlanes = []

				mat.clippingPlanes.length = 0
				mat.clipIntersection = clipIntersection
				mat.clipShadows = clipShadows

				for (const plane of clipPlanes) {
					if (!plane.__clip) continue
					mat.clippingPlanes.push(flipClip ? plane.__inverseClip : plane.__clip)
				}
			})

			// No onCleanup for this.#observer needed here because unloadGL handles it.
		})
	}

	override unloadGL() {
		// TODO why is this needed?
		if (!this.element.scene) return

		refCount--
		if (!refCount) this.element.scene.__localClipping = false

		this.#observer?.disconnect()
		this.#observer = null
	}
}

if (globalThis.window?.document && !elementBehaviors.has('clip-planes'))
	elementBehaviors.define('clip-planes', ClipPlanesBehavior)

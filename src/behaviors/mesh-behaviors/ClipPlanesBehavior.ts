import {autorun, stringAttribute, reactive, booleanAttribute} from '@lume/element'
import {MeshBehavior} from './MeshBehavior.js'
import {ClipPlane} from '../../core/ClipPlane.js'

import type {Material} from 'three'

export type ClipPlanesBehaviorAttributes = 'clipPlanes'

let refCount = 0

/**
 * @class ClipPlaneBehavior
 *
 * When applied to an element with GL content, allows specifying one or more
 * planes to clip the content with.
 *
 * This class extends from MeshBehavior, enforcing that the behavior can be used
 * only on elements that have geometry and material.
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
	static _observedProperties = ['clipPlanes', 'flipClip', ...(MeshBehavior._observedProperties || [])]

	// TODO reactive array?
	#clipPlanes: Array<ClipPlane> = []
	#rawClipPlanes: string | Array<ClipPlane | string> = []

	/**
	 * @property {string | Array<ClipPlane | string | null>} clipPlanes
	 *
	 * *attribute*
	 *
	 * Adds a clip-planes attribute to the host elements that accepts one or
	 * more selectors, comma separated, that define which `<lume-clip-plane>`
	 * elements are to be used as clip planes. If a selector matches an element
	 * that is not a `<lume-clip-plane>`, it is ignored. If a selector matches
	 * more than one element, all of them that are clip planes are used.
	 *
	 * ```html
	 * <lume-box has="clip-planes" clip-planes=".foo, .bar"></lume-box>
	 * ```
	 *
	 * The property can also be set with a string (comma separated selectors),
	 * or a mixed array of strings (selectors) or `<lume-clip-plane>` element
	 * instances.
	 *
	 * ```js
	 * const plane = document.querySelector('.some-clip-plane')
	 * mesh.clipPlanes = [plane, "#someOtherPlane"]
	 * ```
	 *
	 * The property getter returns the current collection of `<lume-clip-plane>`
	 * instances that are being applied, not the original string or array of
	 * values passed into the attribute or setter.
	 */
	@stringAttribute('')
	get clipPlanes(): Array<ClipPlane> {
		return this.#clipPlanes
	}
	set clipPlanes(value: string | Array<ClipPlane | string>) {
		this.#rawClipPlanes = value

		let array: Array<ClipPlane | string> = []

		if (typeof value === 'string') {
			array = value.split(',').filter(v => !!v.trim())
		} else if (Array.isArray(value)) {
			array = value
		} else {
			throw new TypeError('Invalid value for clipPlanes')
		}

		this.#clipPlanes = []

		for (const v of array) {
			if (typeof v !== 'string') {
				this.#clipPlanes.push(v)
				continue
			}

			let root = this.element.getRootNode() as Document | ShadowRoot | null

			console.log(' *** search for plane:', v, root)

			// TODO Should we not search up the composed tree, and stay only
			// in the current ShadowRoot?

			while (root) {
				const plane = root.querySelector(v)

				console.log('query result:', v, plane)

				if (plane) {
					console.log(' *** plane found?', plane)

					// Find only planes participating in rendering (i.e. in the
					// composed tree, noting that .scene is null when not
					// composed)
					if (plane instanceof ClipPlane && plane.scene) this.#clipPlanes.push(plane)

					// TODO
					// If a lume-clip-plane element was not yet upgraded, it
					// will not be found here. We need to also use
					// MutationObserver on the root, or something, to detect
					// upgraded lume-clip-planes
					//
					// We need to also react to added/removed lume-clip-planes

					// If we found an element, but it's the wrong type, end
					// search, don't use it.
					break
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
	 * By default, the side of a plane that is clipped is in its positive Z
	 * direction. Setting this to `true` will reverse clipping to the other
	 * side.
	 */
	@booleanAttribute(false) flipClip = false

	#observer: MutationObserver | null = null

	override loadGL() {
		if (!super.loadGL()) return false

		if (!refCount) this.element.scene!.__localClipping = true
		refCount++

		console.log('ROOT????', this.element.getRootNode())

		// loadGL may fire during parsing before children exist. This
		// MutationObserver will also fire during parsing. This allows us to
		// re-run the query logic for the clip-planes="" prop whenever DOM in
		// the current root changes.
		// TODO we need to observe all the way up the composed tree, or we
		// should make clipPlanes's querying scoped to the nearest root, for
		// consistency.  This covers most cases, for now.
		this.#observer = new MutationObserver(() => {
			// TODO this could be more efficient if we check the added nodes directly, but for now we re-run the query logic.
			this.clipPlanes = this.#rawClipPlanes
		})

		this.#observer.observe(this.element.getRootNode(), {childList: true, subtree: true})

		this._stopFns.push(
			autorun(() => {
				const planes = this.clipPlanes
				const flip = this.flipClip
				const mat: Material = this.getMeshComponent('material')

				if (!mat) return

				this.element.needsUpdate()

				if (!planes.length) {
					mat.clippingPlanes = null
					mat.clipShadows = false // FIXME upstream: don't forget this or Three.js has a bug that still attempts to perform clipping even if clippingPlanes is null.
					return
				}

				if (!mat.clippingPlanes) {
					mat.clippingPlanes = []
					mat.clipShadows = true // TODO: attribute for this too, but seems unnecessary.
				}

				mat.clippingPlanes.length = 0

				for (const plane of planes) {
					if (!plane?.clip) continue
					mat.clippingPlanes.push(flip ? plane.inverseClip : plane.clip)
				}
			}),
		)

		return true
	}

	override unloadGL() {
		if (!super.unloadGL()) return false

		refCount--
		if (!refCount) this.element.scene!.__localClipping = false

		this.#observer?.disconnect()
		this.#observer = null

		return true
	}
}

if (!elementBehaviors.has('clip-planes')) elementBehaviors.define('clip-planes', ClipPlanesBehavior)

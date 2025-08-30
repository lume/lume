import {createEffect, onCleanup} from 'solid-js'
import {stringAttribute, booleanAttribute, element} from '@lume/element'
import {ClipPlane} from '../core/ClipPlane.js'
import {MeshBehavior} from './MeshBehavior.js'
import {autoDefineElements} from '../LumeConfig.js'
import type {MaterialBehavior} from './index.js'
import type {Scene} from '../core/Scene.js'

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
 * Element: `clip-planes`
 *
 * When applied to an element with GL content, allows specifying one or more
 * [`<lume-clip-plane>`](../../core/ClipPlane) elements to clip the content with.
 *
 * This class extends from `MeshBehavior`, enforcing that the behavior can be used
 * only on elements that have a geometry and material.
 *
 * @extends MeshBehavior
 * @element clip-planes
 */
export
@element('clip-planes', autoDefineElements)
class ClipPlanesBehavior extends MeshBehavior {
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
	@booleanAttribute clipIntersection = false

	/**
	 * @property {boolean} clipShadows
	 *
	 * `attribute`
	 *
	 * Default: 'true'
	 *
	 * Defines whether clipping affects shadows casted by the object.
	 */
	@booleanAttribute clipShadows = true

	/**
	 * @property {boolean} flipClip
	 *
	 * `attribute`
	 *
	 * Default: 'false'
	 *
	 * Defines whether to flip the clipped away area. When set to true, the
	 * clipped away area is kept and the non-clipped area is removed.
	 */
	@booleanAttribute flipClip = false

	/**
	 * @property {boolean} clipDisabled
	 *
	 * `attribute`
	 *
	 * Default: 'false'
	 *
	 * When `true`, disables clipping for this object.
	 */
	@booleanAttribute clipDisabled = false

	/**
	 * @property {string} clipPlanes
	 *
	 * `attribute`
	 *
	 * Default: `""`
	 *
	 * A space-separated list of CSS-selector values used to select
	 * ClipPlane elements to clip the object with.
	 */
	@stringAttribute clipPlanes = ''

	#ownedClipPlanes: ClipPlane[] = []
	#trackedClipPlanes: ClipPlane[] = []

	#id = ++refCount

	override connectedCallback() {
		super.connectedCallback()

		this.createEffect(this.#handleClipPlanes)
	}

	#handleClipPlanes = () => {
		let clipPlanes: ClipPlane[] = []

		if (this.clipPlanes) {
			const selectors = this.clipPlanes.split(/\s+/)
			const scene = this.parentElement?.scene as Scene | undefined

			if (scene) {
				for (const s of selectors) {
					if (!s) continue
					clipPlanes.push(...scene.querySelectorAll(s))
				}
			}
		} else {
			clipPlanes = this.#ownedClipPlanes
		}

		const hasClips = clipPlanes.length > 0

		// TODO handle changing set of clip planes while connected (track previous set)
		this.createEffect(() => {
			const meshComponent = this.meshComponent as MaterialBehavior | null

			if (!meshComponent || !hasClips) return

			// Ensure a material instance exists
			const material = meshComponent.meshComponent
			if (!material) return

			// Apply clipping settings to the material
			material.clipIntersection = this.clipIntersection
			material.clipShadows = this.clipShadows
			material.side = this.flipClip ? 2 : 0 // 2 = BackSide, 0 = FrontSide

			// TODO: Apply actual clipping planes to the material
			// This would involve converting ClipPlane elements to Three.js Plane objects
			// and setting them on material.clippingPlanes

			this.parentElement?.needsUpdate()
		})

		// Clean up tracking
		onCleanup(() => {
			this.#trackedClipPlanes.length = 0
		})
	}
}
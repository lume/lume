import {createEffect, onCleanup} from 'solid-js'
import {stringAttribute, booleanAttribute, element} from '@lume/element'
import {ClipPlane} from '../core/ClipPlane.js'
import {MeshBehavior} from './MeshBehavior.js'
import {autoDefineElements} from '../LumeConfig.js'

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

	override connectedCallback() {
		super.connectedCallback()

		this.createEffect(() => {
			// TODO: Implement clipping plane logic
			// For now this is just a placeholder to demonstrate the structure
			this.parentElement?.needsUpdate()
		})
	}
}
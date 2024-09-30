// Useful info on THREE.Plane not covered in Three.js docs:
// https://www.columbia.edu/~njn2118/journal/2019/2/18.html

import {element, type ElementAttributes} from '@lume/element'
import {signal} from 'classy-solid'
import {Plane} from 'three/src/math/Plane.js'
import {Vector3} from 'three/src/math/Vector3.js'
import {Element3D, type Element3DAttributes} from './Element3D.js'
import {autoDefineElements} from '../LumeConfig.js'

// Make the clip plane clip anything in front of it (towards the default
// camera). Three.js clips anything along -Z, so we negate Z to clip along +Z
// towards the camera by default.
const clipNormal: [number, number, number] = [0, 0, -1]

export type ClipPlaneAttributes = Element3DAttributes

/**
 * @class ClipPlane
 *
 * Element: `lume-clip-plane`
 *
 * An non-rendered plane that can be placed anywhere in 3D space to clip an
 * element on one side of the plane. The plane is infinite.
 *
 * To visualize a portion of the plane, we can place a `<lume-plane>` as a
 * child of a `<lume-clip-plane>`, as in the below example.
 *
 * To clip an element, add a
 * [`clip-planes`](../behaviors/mesh-behaviors/ClipPlanesBehavior) behavior to the
 * element with the `has=""` attribute, then assign any number of connected
 * `<lume-clip-plane>` elements to the element's `clipPlanes` property.
 *
 * <live-code id="clipExample"></live-code>
 * <script>
 *   clipExample.content = clipPlaneExample
 * </script>
 *
 * @extends Element3D
 */
export
@element('lume-clip-plane', autoDefineElements)
class ClipPlane extends Element3D {
	/**
	 * *reactive* *readonly*
	 *
	 * Returns the underlying `THREE.Plane` if applicable: when WebGL rendering is enabled
	 * for the scene and the element participates in rendering.
	 * Used by `ClipPlanesBehavior`
	 */
	@signal threeClip: Plane = new Plane(new Vector3(...clipNormal))

	/**
	 * *reactive* *readonly*
	 *
	 * Returns the inverse underlying `THREE.Plane` if applicable: when WebGL rendering is enabled
	 * for the scene and the element participates in rendering.
	 * Used by `ClipPlanesBehavior`
	 */
	@signal threeInverseClip: Plane = new Plane(new Vector3(...clipNormal).negate())

	override updateWorldMatrices() {
		super.updateWorldMatrices()

		const plane = this.threeClip
		const inverse = this.threeInverseClip

		// These only exist if WebGL mode is enabled.
		if (!plane || !inverse) return

		plane.normal.set(...clipNormal)
		plane.constant = 0
		inverse.normal.set(...clipNormal).negate()
		inverse.constant = 0

		// Clip planes are world-positioned.
		plane.applyMatrix4(this.three.matrixWorld)
		inverse.applyMatrix4(this.three.matrixWorld)
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-clip-plane': ElementAttributes<ClipPlane, ClipPlaneAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-clip-plane': ClipPlane
	}
}

// Useful info on THREE.Plane not covered in Three.js docs:
// https://www.columbia.edu/~njn2118/journal/2019/2/18.html

import {element} from '@lume/element'
import {Plane} from 'three/src/math/Plane.js'
import {Vector3} from 'three/src/math/Vector3.js'
import {createSignal} from 'solid-js'
import {Node} from './Node.js'
import {autoDefineElements} from '../LumeConfig.js'

// Make the clip plane clip anything in front of it (towards the default
// camera). Three.js clips anything along -Z, so we negate Z to clip along +Z
// towards the camera by default.
const clipNormal: [number, number, number] = [0, 0, -1]

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
 * [`clip-planes`](../behaviors/mesh-behaviors/ClipPlane) behavior to the
 * element with the `has=""` attribute, then assign any number of connected
 * `<lume-clip-plane>` elements to the element's `clipPlanes` property.
 *
 * <div id="clipPlaneExample"></div>
 *
 * <script type="application/javascript">
 *   new Vue({ el: '#clipPlaneExample', data: { code: clipPlaneExample }, template: '<live-code :template="code" mode="html>iframe" :debounce="200" />' })
 * </script>
 *
 * @extends Node
 */
@element('lume-clip-plane', autoDefineElements)
export class ClipPlane extends Node {
	#plane = createSignal<Plane | null>(null)
	#inversePlane = createSignal<Plane | null>(null)

	/**
	 * @-property {THREE.Plane | null} clip
	 *
	 * *reactive* *readonly*
	 *
	 * Returns the underlying `THREE.Plane` if applicable: when WebGL rendering is enabled
	 * for the scene and the element participates in rendering.
	 */
	get clip(): Readonly<Plane> | null {
		return this.#plane[0]()
	}

	get inverseClip(): Readonly<Plane> | null {
		return this.#inversePlane[0]()
	}

	override _loadGL() {
		if (!super._loadGL()) return false
		this.#plane[1](new Plane(new Vector3(...clipNormal)))
		this.#inversePlane[1](new Plane(new Vector3(...clipNormal).negate()))
		return true
	}

	override _unloadGL() {
		if (!super._unloadGL()) return false
		this.#plane[1](null)
		this.#inversePlane[1](null)
		return true
	}

	override update(t: number, dt: number) {
		super.update(t, dt)

		const plane = this.#plane[0]()
		const inverse = this.#inversePlane[0]()

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

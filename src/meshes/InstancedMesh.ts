import {batch, untrack} from 'solid-js'
import {element, numberAttribute, stringAttribute, type ElementAttributes} from '@lume/element'
import {InstancedMesh as ThreeInstancedMesh} from 'three/src/objects/InstancedMesh.js'
import {BoxGeometry} from 'three/src/geometries/BoxGeometry.js'
import {MeshPhongMaterial} from 'three/src/materials/MeshPhongMaterial.js'
import {DynamicDrawUsage} from 'three/src/constants.js'
import {Quaternion} from 'three/src/math/Quaternion.js'
import {Vector3} from 'three/src/math/Vector3.js'
import {Color} from 'three/src/math/Color.js'
import {Matrix4} from 'three/src/math/Matrix4.js'
import {Euler} from 'three/src/math/Euler.js'
import {Mesh, type MeshAttributes} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'
import {stringToNumberArray} from './utils.js'
import {queueMicrotaskOnceOnly} from '../utils/queueMicrotaskOnceOnly.js'

import type {GeometryBehavior, MaterialBehavior} from '../behaviors/index.js'

export type InstancedMeshAttributes = MeshAttributes | 'count' | 'rotations' | 'positions' | 'scales' | 'colors'

const quat = new Quaternion()
const pos = new Vector3()
const scale = new Vector3()
const pivot = new Vector3()
const mat = new Matrix4()
const rot = new Euler()
const color = new Color()

// const threeJsPostAdjustment = [0, 0, 0]
// const alignAdjustment = [0, 0, 0]
// const mountPointAdjustment = [0, 0, 0]
const appliedPosition = [0, 0, 0]

/**
 * @element lume-instanced-mesh
 * @class InstancedMesh - This is similar to Mesh, but renders multiple
 * "instances" of a geometry (insead of only one) with a single draw call to
 * the GPU, as if all the instances were a single geometry. This is more
 * efficient in cases where multiple objects to be rendered are similar
 * (share the same geometry and material). Rendering multiple similar objects
 * as separate Mesh instances would otherwise incur one draw call to the GPU
 * per mesh which will be slower.
 *
 * For sake of simplicity, `<lume-instanced-mesh>` has a box-geometry and
 * phong-material by default.
 *
 * ## Example
 *
 * <live-code id="liveExample"></live-code>
 * <script>
 *   liveExample.content = instancedMeshExample
 * </script>
 *
 * @extends Mesh
 *
 */
export
@element('lume-instanced-mesh', autoDefineElements)
class InstancedMesh extends Mesh {
	/**
	 * @property {number} count - The number of instances to render.
	 */
	@numberAttribute count = 10

	#biggestCount = this.count

	/**
	 * @property {number[]} rotations - The rotations for each instance.
	 * Generally the array should have a length of `this.count * 3` because
	 * each rotation consists of three numbers for X, Y, and Z axes. Every three
	 * numbers is one X,Y,Z triplet. If the array has less rotations than
	 * `this.count`, the missing rotations will be considered to have
	 * values of zero. If it has more than `this.count` rotations, those
	 * rotations are ignored.
	 */
	@stringAttribute get rotations(): number[] {
		return this.#rotations
	}
	@stringAttribute set rotations(v: number[] | string) {
		this.#rotations = stringToNumberArray(v, 'rotations')
	}

	#rotations: number[] = []

	/**
	 * @property {number[]} positions - The positions for each instance.
	 * Generally the array should have a length of `this.count * 3` because
	 * each rotation consists of three numbers for X, Y, and Z axes. Every three
	 * numbers is one X,Y,Z triplet. If the array has less positions than
	 * `this.count`, the missing positions will be considered to have
	 * values of zero. If it has more than `this.count` positions, those
	 * positions are ignored.
	 */
	@stringAttribute get positions() {
		return this.#positions
	}
	@stringAttribute set positions(v: number[]) {
		this.#positions = stringToNumberArray(v, 'positions')
	}

	#positions: number[] = []

	/**
	 * @property {number[]} scales - The scales for each instance.
	 * Generally the array should have a length of `this.count * 3` because
	 * each rotation consists of three numbers for X, Y, and Z axes. Every three
	 * numbers is one X,Y,Z triplet. If the array has less scales than
	 * `this.count`, the missing scales will be considered to have
	 * values of zero. If it has more than `this.count` scales, those
	 * scales are ignored.
	 */
	@stringAttribute get scales() {
		return this.#scales
	}
	@stringAttribute set scales(v: number[]) {
		this.#scales = stringToNumberArray(v, 'scales')
	}

	#scales: number[] = []

	/**
	 * @property {number[]} colors - The colors for each instance.
	 * Generally the array should have a length of `this.count * 3` because
	 * each rotation consists of three numbers for R, G, and B color components. Every three
	 * numbers is one R,G,B triplet. If the array has less colors than
	 * `this.count`, the missing colors will be considered to have
	 * values of zero (black). If it has more than `this.count` colors, those
	 * colors are ignored.
	 */
	@stringAttribute get colors() {
		return this.#colors
	}
	@stringAttribute set colors(v: number[]) {
		this.#colors = stringToNumberArray(v, 'colors')
	}

	#colors: number[] = []

	override initialBehaviors = {geometry: 'box', material: 'physical'}

	// This class will have a THREE.InstancedMesh for its .three property.
	override makeThreeObject3d() {
		let geometryBehavior: GeometryBehavior | null = null
		let materialBehavior: MaterialBehavior | null = null

		for (const [name, behavior] of this.behaviors) {
			if (name.endsWith('-geometry')) geometryBehavior = behavior as GeometryBehavior
			else if (name.endsWith('-material')) materialBehavior = behavior as MaterialBehavior
		}

		// Use the existing geometry and material from the behaviors in case we are in the recreateThree process.
		const mesh = new ThreeInstancedMesh(
			geometryBehavior?.meshComponent || new BoxGeometry(),
			materialBehavior?.meshComponent || new MeshPhongMaterial(),
			this.#biggestCount,
		)

		// TODO make this configurable. Most people probably won't care about this.
		mesh.instanceMatrix.setUsage(DynamicDrawUsage)

		const original = mesh.setColorAt
		mesh.setColorAt = function (index, color) {
			// This creates the instanceColor buffer if it doesn't exist.
			original.call(mesh, index, color)

			// TODO make this configurable. Most people probably won't care about this.
			mesh.instanceColor!.setUsage(DynamicDrawUsage)
		}

		return mesh
	}

	#allMatricesNeedUpdate = false
	#allColorsNeedUpdate = false
	// TODO (https://github.com/lume/lume/issues/297) we will need to invert
	// this to be #updateAllInstances based on if attributes changed when we
	// update to non-synchronous effects (f.e. Solid 2.0, or TC39 Signals), as
	// the currently synchronous expectation will break the behavior. Instead,
	// setting an attribute should synchronously set #updateAllInstances to
	// true, otherwise an other updates (f.e. setInstancePosition) should
	// update only a single instance.
	#updateSingleInstanceOnly = false

	/**
	 * @method setInstancePosition - Set the position of a specific instance at
	 * the given index. Use this instead of the [`positions`](#positions)
	 * attribute when you only need to update a small number of instances for
	 * optimization.
	 * @param {number} index - The instance index.
	 * @param {number} x - The x component of the position.
	 * @param {number} y - The y component of the position.
	 * @param {number} z - The z component of the position.
	 */
	setInstancePosition(index: number, x: number, y: number, z: number) {
		const arrIndex = index * 3

		// Untrack because the purpose of the method is to update this, not read it.
		untrack(() => {
			this.positions[arrIndex] = x
			this.positions[arrIndex + 1] = y
			this.positions[arrIndex + 2] = z

			this.#setMatrix(arrIndex)
			this.three.instanceMatrix.needsUpdate = true
		})

		queueMicrotaskOnceOnly(this.#triggerPositions)
	}

	#triggerPositions = () => {
		this.#updateSingleInstanceOnly = true
		this.positions = this.positions // trigger reactivity
	}

	/**
	 * @method setInstanceScale - Set the scale of a specific instance at the
	 * given index. Use this instead of the [`scales`](#scales) attribute when
	 * you only need to update a small number of instances for optimization.
	 * @param {number} index - The instance index.
	 * @param {number} x - The x component of the scale.
	 * @param {number} y - The y component of the scale.
	 * @param {number} z - The z component of the scale.
	 */
	setInstanceScale(index: number, x: number, y: number, z: number) {
		const arrIndex = index * 3

		// Untrack because the purpose of the method is to update this, not read it.
		untrack(() => {
			this.scales[arrIndex] = x
			this.scales[arrIndex + 1] = y
			this.scales[arrIndex + 2] = z

			this.#setMatrix(arrIndex)
			this.three.instanceMatrix.needsUpdate = true
		})

		queueMicrotaskOnceOnly(this.#triggerScales)
	}

	#triggerScales = () => {
		this.#updateSingleInstanceOnly = true
		this.scales = this.scales // trigger reactivity
	}

	/**
	 * @method setInstanceRotation - Set the rotation of a specific instance at
	 * the given index. Use this instead of the [`rotations`](#rotations)
	 * attribute when you only need to update a small number of instances for
	 * optimization.
	 * @param {number} index - The instance index.
	 * @param {number} x - The x component of the rotation.
	 * @param {number} y - The y component of the rotation.
	 * @param {number} z - The z component of the rotation.
	 */
	setInstanceRotation(index: number, x: number, y: number, z: number) {
		const arrIndex = index * 3

		// Untrack because the purpose of the method is to update this, not read it.
		untrack(() => {
			this.rotations[arrIndex] = x
			this.rotations[arrIndex + 1] = y
			this.rotations[arrIndex + 2] = z

			this.#setMatrix(arrIndex)
			this.three.instanceMatrix.needsUpdate = true
		})

		queueMicrotaskOnceOnly(this.#triggerRotations)
	}

	#triggerRotations = () => {
		this.#updateSingleInstanceOnly = true
		this.rotations = this.rotations // trigger reactivity
	}

	/**
	 * @method setInstanceColor - Set the color of a specific instance at the
	 * given index. Use this instead of the [`colors`](#colors) attribute when
	 * you only need to update a small number of instances for optimization.
	 * @param {number} index - The instance index.
	 * @param {number} r - The r component of the color.
	 * @param {number} g - The g component of the color.
	 * @param {number} b - The b component of the color.
	 */
	setInstanceColor(index: number, r: number, g: number, b: number) {
		const arrIndex = index * 3

		// Untrack because the purpose of the method is to update this, not read it.
		untrack(() => {
			this.colors[arrIndex] = r
			this.colors[arrIndex + 1] = g
			this.colors[arrIndex + 2] = b
		})

		this.#setColor(index, r, g, b)
		this.three.instanceColor!.needsUpdate = true

		queueMicrotaskOnceOnly(this.#triggerColors)
	}

	#triggerColors = () => {
		this.#updateSingleInstanceOnly = true
		this.colors = this.colors // trigger reactivity
	}

	// TODO Might just be able to set individual components of the matrix
	// without recalculating other components (f.e. if only an instance position
	// changed but not rotation)
	#setMatrix(index: number) {
		rot.set(this.rotations[index + 0] ?? 0, this.rotations[index + 1] ?? 0, this.rotations[index + 2] ?? 0)
		quat.setFromEuler(rot)
		pos.set(this.positions[index + 0] ?? 0, this.positions[index + 1] ?? 0, this.positions[index + 2] ?? 0)
		scale.set(this.scales[index + 0] ?? 1, this.scales[index + 1] ?? 1, this.scales[index + 2] ?? 1)

		// Modifies _mat in place.
		this._calculateInstanceMatrix(pos, quat, scale, pivot, mat)

		this.three.setMatrixAt(index / 3, mat)
	}

	// TODO a colorMode variable can specify whether colors are RGB triplets, or CSS string/hex values.
	// TODO Set an update range so that if we're updating only one instance, we're not uploading the whole array each time.
	#setColor(index: number, r: number, g: number, b: number) {
		color.setRGB(r, g, b)
		this.three.setColorAt(index, color)
	}

	updateAllMatrices() {
		for (let i = 0, l = this.count; i < l; i += 1) this.#setMatrix(i * 3)
		this.three.instanceMatrix.needsUpdate = true
	}

	updateAllColors() {
		for (let i = 0, l = this.count; i < l; i += 1) {
			const j = i * 3
			const r = this.colors[j + 0] ?? 1
			const g = this.colors[j + 1] ?? 1
			const b = this.colors[j + 2] ?? 1

			this.#setColor(i, r, g, b)
		}

		this.three.instanceColor!.needsUpdate = true
	}

	/**
	 * This is very similar to SharedAPI._calculateMatrix, without the threeCSS parts.
	 */
	_calculateInstanceMatrix(pos: Vector3, quat: Quaternion, scale: Vector3, pivot: Vector3, result: Matrix4): void {
		// const align = new Vector3(0, 0, 0) // TODO
		// const mountPoint = new Vector3(0, 0, 0) // TODO
		const position = pos
		const origin = new Vector3(0.5, 0.5, 0.5) // TODO

		const size = this.calculatedSize

		// In the following commented code, we ignore the
		// threeJsPostAdjustment, alignAdjustment, and mountPointAdjustment
		// because the align point and mount point of the instances are
		// inherited from the IntancedMesh element's positioning.  In other
		// words, the instances are positioned relative to the element's
		// position, which already has alignPoint and mountPoint factored into
		// it.
		// TODO Should we provide the same alignment and mount point API for
		// instances, and would align point be relative to the InstancedMesh
		// element (as if instances are sub nodes of the InstancedMesh
		// element), or to the InstancedMesh element's parent (as if instances
		// are sub nodes of the parent, just like a single mesh would be)?

		// THREE-COORDS-TO-DOM-COORDS
		// translate the "mount point" back to the top/left/back of the object
		// (in Three.js it is in the center of the object).
		// threeJsPostAdjustment[0] = size.x / 2
		// threeJsPostAdjustment[1] = size.y / 2
		// threeJsPostAdjustment[2] = size.z / 2

		// const parentSize = this._getParentSize()

		// THREE-COORDS-TO-DOM-COORDS
		// translate the "align" back to the top/left/back of the parent element.
		// We offset this in ElementOperations#applyTransform. The Y
		// value is inverted because we invert it below.
		// threeJsPostAdjustment[0] += -parentSize.x / 2
		// threeJsPostAdjustment[1] += -parentSize.y / 2
		// threeJsPostAdjustment[2] += -parentSize.z / 2

		// alignAdjustment[0] = parentSize.x * align.x
		// alignAdjustment[1] = parentSize.y * align.y
		// alignAdjustment[2] = parentSize.z * align.z

		// mountPointAdjustment[0] = size.x * mountPoint.x
		// mountPointAdjustment[1] = size.y * mountPoint.y
		// mountPointAdjustment[2] = size.z * mountPoint.z

		appliedPosition[0] = position.x /*+ alignAdjustment[0] - mountPointAdjustment[0]*/
		appliedPosition[1] = position.y /*+ alignAdjustment[1] - mountPointAdjustment[1]*/
		appliedPosition[2] = position.z /*+ alignAdjustment[2] - mountPointAdjustment[2]*/

		// NOTE We negate Y translation in several places below so that Y
		// goes downward like in DOM's CSS transforms.

		position.set(
			appliedPosition[0] /*+ threeJsPostAdjustment[0]*/,
			// THREE-COORDS-TO-DOM-COORDS negate the Y value so that
			// Three.js' positive Y is downward like DOM.
			-(appliedPosition[1] /*+ threeJsPostAdjustment[1]*/),
			appliedPosition[2] /*+ threeJsPostAdjustment[2]*/,
		)

		if (origin.x !== 0.5 || origin.y !== 0.5 || origin.z !== 0.5) {
			// Here we multiply by size to convert from a ratio to a range
			// of units, then subtract half because Three.js origin is
			// centered around (0,0,0) meaning Three.js origin goes from
			// -0.5 to 0.5 instead of from 0 to 1.

			pivot.set(
				origin.x * size.x - size.x / 2,
				// THREE-COORDS-TO-DOM-COORDS negate the Y value so that
				// positive Y means down instead of up (because Three,js Y
				// values go up).
				-(origin.y * size.y - size.y / 2),
				origin.z * size.z - size.z / 2,
			)
		}
		// otherwise, use default Three.js origin of (0,0,0) which is
		// equivalent to our (0.5,0.5,0.5), by removing the pivot value.
		else {
			pivot.set(0, 0, 0)
		}

		// effectively the same as Object3DWithPivot.updateMatrix() {

		result.compose(position, quat, scale)

		if (pivot.x !== 0 || pivot.y !== 0 || pivot.z !== 0) {
			const px = pivot.x,
				py = pivot.y,
				pz = pivot.z
			const te = result.elements

			te[12] += px - te[0] * px - te[4] * py - te[8] * pz
			te[13] += py - te[1] * px - te[5] * py - te[9] * pz
			te[14] += pz - te[2] * px - te[6] * py - te[10] * pz
		}

		// }
	}

	override connectedCallback() {
		super.connectedCallback()

		this.createEffect(() => {
			// Increase the InstancedMesh size (by making a new one) as needed.
			if (this.count > this.#biggestCount) {
				this.#biggestCount = this.count

				this.recreateThree()

				// Be sure to trigger all the instance components so that the new
				// InstancedMesh will be up-to-date.
				untrack(() => {
					batch(() => {
						this.rotations = this.rotations
						this.positions = this.positions
						this.scales = this.scales
						this.colors = this.colors
					})
				})
			}

			untrack(() => (this.three.count = this.count))

			this.needsUpdate()
		})

		this.createEffect(() => {
			this.rotations
			if (!this.#updateSingleInstanceOnly) this.#allMatricesNeedUpdate = true
			this.#updateSingleInstanceOnly = false
			this.needsUpdate()
		})

		this.createEffect(() => {
			this.positions
			if (!this.#updateSingleInstanceOnly) this.#allMatricesNeedUpdate = true
			this.#updateSingleInstanceOnly = false
			this.needsUpdate()
		})

		this.createEffect(() => {
			this.scales
			if (!this.#updateSingleInstanceOnly) this.#allMatricesNeedUpdate = true
			this.#updateSingleInstanceOnly = false
			this.needsUpdate()
		})

		this.createEffect(() => {
			this.colors
			if (!this.#updateSingleInstanceOnly) this.#allColorsNeedUpdate = true
			this.#updateSingleInstanceOnly = false
			this.needsUpdate()
		})
	}

	override update(t: number, dt: number) {
		super.update(t, dt)

		if (this.#allMatricesNeedUpdate) {
			this.#allMatricesNeedUpdate = false
			this.updateAllMatrices()
		}
		if (this.#allColorsNeedUpdate) {
			this.#allColorsNeedUpdate = false
			this.updateAllColors()
		}
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-instanced-mesh': ElementAttributes<InstancedMesh, InstancedMeshAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-instanced-mesh': InstancedMesh
	}
}

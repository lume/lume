import {MeshPhongMaterial} from 'three/src/materials/MeshPhongMaterial'
import {Color} from 'three/src/math/Color'
import {defer} from '../core/Utility'

import type {Object3D} from 'three/src/core/Object3D'
import type {Material} from 'three/src/materials/Material'
import type {RenderItem} from 'three/src/renderers/webgl/WebGLRenderLists'
import type {Quaternion} from 'three/src/math/Quaternion'
import type {Camera} from 'three/src/cameras/Camera'
import type {OrthographicCamera} from 'three/src/cameras/OrthographicCamera'
import type {PerspectiveCamera} from 'three/src/cameras/PerspectiveCamera'

export type TColor = Color | string | number

export function isRenderItem(obj: any): obj is RenderItem {
	return 'geometry' in obj && 'material' in obj
}

export function disposeMaterial(obj: Object3D) {
	if (!isRenderItem(obj)) return

	// because obj.material can be a material or array of materials
	const materials: Material[] = ([] as Material[]).concat(obj.material)

	for (const material of materials) {
		material.dispose()
	}
}

export function disposeObject(obj: Object3D, removeFromParent = true, destroyGeometry = true, destroyMaterial = true) {
	if (!obj) return

	if (isRenderItem(obj)) {
		if (obj.geometry && destroyGeometry) obj.geometry.dispose()
		if (destroyMaterial) disposeMaterial(obj)
	}

	removeFromParent &&
		defer(() => {
			// if we remove children in the same tick then we can't continue traversing,
			// so we defer to the next microtask
			obj.parent && obj.parent.remove(obj)
		})
}

type DisposeOptions = Partial<{
	removeFromParent: boolean
	destroyGeometry: boolean
	destroyMaterial: boolean
}>

export function disposeObjectTree(obj: Object3D, disposeOptions: DisposeOptions = {}) {
	obj.traverse(node => {
		disposeObject(
			node,
			disposeOptions.removeFromParent,
			disposeOptions.destroyGeometry,
			disposeOptions.destroyMaterial,
		)
	})
}

export function quaternionApproximateEquals(a: Quaternion, b: Quaternion, epsilon: number) {
	return (
		Math.abs(a.x - b.x) < epsilon &&
		Math.abs(a.y - b.y) < epsilon &&
		Math.abs(a.z - b.z) < epsilon &&
		Math.abs(a.w - b.w) < epsilon
	)
}

export function applyMaterial(obj: Object3D, material: Material, dispose = true) {
	if (!isRenderItem(obj)) return
	if (dispose && obj.material) disposeMaterial(obj)
	obj.material = material
}

export function setRandomColorPhongMaterial(obj: Object3D, dispose?: boolean, traverse?: boolean) {
	const randomColor = (0xffffff / 3) * Math.random() + 0xffffff / 3
	setColorPhongMaterial(obj, randomColor, dispose, traverse)
}

export function setColorPhongMaterial(obj: Object3D, color: TColor, dispose?: boolean, traverse = true) {
	const material = new MeshPhongMaterial()
	material.color = new Color(color)

	if (traverse) obj.traverse(node => applyMaterial(node, material, dispose))
	else applyMaterial(obj, material, dispose)
}

export function isPerspectiveCamera(camera: Camera): camera is PerspectiveCamera {
	return !!(camera as any).isPerspectiveCamera
}

export function isOrthographicCamera(camera: Camera): camera is OrthographicCamera {
	return !!(camera as any).isOrthographicCamera
}

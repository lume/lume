import type {Object3D} from 'three/src/core/Object3D.js'
import type {Material} from 'three/src/materials/Material.js'
import {isRenderItem} from './is.js'

export interface Disposable {
	dispose: () => void
}

export function isDisposable(o: any): o is Disposable {
	return !!(typeof o === 'object' && o && 'dispose' in o)
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
		queueMicrotask(() => {
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
		disposeObject(node, disposeOptions.removeFromParent, disposeOptions.destroyGeometry, disposeOptions.destroyMaterial)
	})
}

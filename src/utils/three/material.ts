import {MeshPhongMaterial} from 'three/src/materials/MeshPhongMaterial.js'
import {Color} from 'three/src/math/Color.js'
import type {Object3D} from 'three/src/core/Object3D.js'
import type {Material} from 'three/src/materials/Material.js'
import {isRenderItem} from './is.js'
import {disposeMaterial} from './dispose.js'

export type TColor = Color | string | number

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

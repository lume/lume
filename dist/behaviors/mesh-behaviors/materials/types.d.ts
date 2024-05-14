// TODO port to TypeScript
declare module 'three-projected-material' {
	import type {Camera, MeshPhysicalMaterial, MeshPhysicalMaterialParameters, Texture, Vector2} from 'three'

	type ProjectedMaterialparameters = {
		camera?: Camera
		texture?: Texture
		textureScale?: number
		textureOffset?: Vector2
		cover?: boolean
	} & MeshPhysicalMaterialParameters

	export default class ProjectedMaterial extends MeshPhysicalMaterial {
		constructor(options: ProjectedMaterialparameters)
	}
}

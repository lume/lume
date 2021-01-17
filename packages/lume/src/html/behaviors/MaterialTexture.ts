import {Mixin, MixinResult, Constructor} from 'lowclass'
import {TextureLoader} from 'three/src/loaders/TextureLoader'
import {reactive, attribute, autorun, StopFunction} from '@lume/element'

import type {MeshPhongMaterial} from 'three/src/materials/MeshPhongMaterial'
import type BaseMeshBehavior from './BaseMeshBehavior'
import type {MeshComponentType} from './BaseMeshBehavior'
import type {Mesh} from '../../core'

/**
 * Mixin class for adding textures to a mesh behavior
 */
function MaterialTextureMixin<T extends Constructor<BaseMeshBehavior>>(Base: T) {
	const Parent = Constructor<BaseMeshBehavior, typeof BaseMeshBehavior>(Base)

	@reactive
	class MaterialTexture extends Parent {
		type: MeshComponentType = 'material'
		element!: Mesh

		@reactive @attribute texture = ''
		@reactive @attribute bumpMap = ''
		@reactive @attribute specularMap = ''

		protected static _observedProperties = [
			'texture',
			'bumpMap',
			'specularMap',
			...(Parent._observedProperties || []),
		]

		private stopFns: StopFunction[] = []

		loadGL() {
			if (!super.loadGL()) return false

			const handleTexture = (sourceProp: keyof this, threeProp: keyof MeshPhongMaterial) => {
				this[sourceProp] // this is a dependency of this computation

				const mat = this.element.three.material as MeshPhongMaterial

				if (!(threeProp in mat)) {
					console.warn(
						`Warning: The material specified for the <${this.element.tagName.toLowerCase()}> element does not support a "${threeProp}" texture.`,
					)
					return
				}

				// Is this how to clean up? See
				// https://discourse.threejs.org/t/the-need-for-a-how-to-clean-things-up-section-of-the-docs/5831
				if (mat[threeProp]) mat[threeProp].dispose()

				if (this[sourceProp]) {
					// TODO The default material color (if not specified) when
					// there's a texture should be white

					// @ts-ignore
					const texture = new TextureLoader().load(this[sourceProp], () => this.element.needsUpdate())

					// TODO handle Material[] arrays
					// @ts-ignore
					mat[threeProp] = texture
				} else {
					// @ts-ignore
					mat[threeProp] = null
				}

				mat.needsUpdate = true // Three.js needs to update the material in the GPU
				this.element.needsUpdate() // Lume needs to re-render
			}

			this.stopFns.push(
				autorun(() => handleTexture('texture', 'map')),
				autorun(() => handleTexture('bumpMap', 'bumpMap')),
				autorun(() => handleTexture('specularMap', 'specularMap')),
			)

			return true
		}

		unloadGL() {
			if (!super.unloadGL()) return false

			for (const stop of this.stopFns) stop()

			const mat = this.element.three.material as MeshPhongMaterial
			if (mat.map) mat.map.dispose()

			return true
		}
	}

	return MaterialTexture as MixinResult<typeof MaterialTexture, T>
}

export const MaterialTexture = Mixin(MaterialTextureMixin)
export interface MaterialTexture extends InstanceType<typeof MaterialTexture> {}
export default MaterialTexture

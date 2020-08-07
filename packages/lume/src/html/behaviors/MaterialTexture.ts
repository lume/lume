import {Mixin, MixinResult, Constructor} from 'lowclass'
import {TextureLoader, MeshPhongMaterial} from 'three'
import {reactive, attribute, autorun, StopFunction} from '@lume/element'
import BaseMeshBehavior, {MeshComponentType} from './BaseMeshBehavior'
import {Mesh} from '../../core'

/**
 * Mixin class for adding textures to a mesh behavior
 */
function MaterialTextureMixin<T extends Constructor<BaseMeshBehavior>>(Base: T) {
	class MaterialTexture extends Constructor<BaseMeshBehavior>(Base) {
		type: MeshComponentType = 'material'
		element!: Mesh

		@reactive @attribute texture = ''

		protected static _observedProperties = ['texture', ...((Base as any).observedProperties || [])]

		private stopFns: StopFunction[] = []

		loadGL() {
			if (!super.loadGL()) return false

			const stop = autorun(() => {
				// "as MeshPhongMaterial" needed because we don't know what
				// material it will be, and Material base class doesn't have
				// `map`., but most other materrials do. So this shows intent,
				// and we assume all materials are subclasses of Material, and
				// have `.map`, at least for now.
				const mat = this.element.three.material as MeshPhongMaterial

				// Is this how to clean up? See https://discourse.threejs.org/t/the-need-for-a-how-to-clean-things-up-section-of-the-docs/5831
				if (mat.map) mat.map.dispose()

				if (this.texture) {
					// TODO The default material color (if not specified) when
					// there's a texture should be white

					const texture = new TextureLoader().load(this.texture, () => this.element.needsUpdate())

					// TODO handle Material[] arrays
					mat.map = texture
				} else {
					mat.map = null
				}

				mat.needsUpdate = true // Three.js needs to update the material in the GPU
				this.element.needsUpdate() // Lume needs to re-render
			})

			this.stopFns.push(stop)

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

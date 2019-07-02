import {Mixin} from 'lowclass'
import {TextureLoader, Material} from 'three'
import WithUpdate from '../WithUpdate'
import {Constructor} from '../../core/Utility'
import Behavior from './Behavior'
import {Mesh} from '../../core'

/**
 * Mixin class for adding textures to a mesh behavior
 */
function MaterialTextureMixin<T extends Constructor<Behavior>>(Base: T) {
    // TODO, use a Pick<> of HTMLElement instead, pick just parts WithUpdate needs.
    class MaterialTexture extends WithUpdate.mixin(Constructor<Behavior>(Base)) {
        static props = {
            ...((Base as any).props || {}),
            texture: String,
        }

        texture!: string
        element!: Mesh

        updated(oldProps: any, modifiedProps: any) {
            super.updated && super.updated(oldProps, modifiedProps)

            const {texture} = modifiedProps

            if (texture && this.texture) {
                // TODO default material color (if not specified) when there's a
                // texture should be white

                const texture = new TextureLoader().load(this.texture, () => this.element.needsUpdate())
                    // as any needed because we don't know what material it will
                    // be, and Material base class doesn't have `map`., but most
                    // other materrials do.
                    // TODO handle material arrays
                ;((this.element.three.material as Material) as any).map = texture
                this.element.needsUpdate()
            }
        }
    }

    return MaterialTexture as Constructor<MaterialTexture & InstanceType<T>> & typeof MaterialTexture & T
}

export const MaterialTexture = Mixin(MaterialTextureMixin)
export type MaterialTexture = InstanceType<typeof MaterialTexture>
export default MaterialTexture

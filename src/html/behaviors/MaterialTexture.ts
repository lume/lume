import Mixin from 'lowclass/Mixin'
import {TextureLoader} from 'three'

// base class for geometry behaviors
function MaterialTextureMixin<T extends Constructor>(Base: T) {
    return class MaterialTexture extends Base {
        static props = {
            ...((Base as any).props || {}),
            texture: String,
        }

        updated(oldProps: any, modifiedProps: any) {
            super.updated && super.updated(oldProps, modifiedProps)

            const {texture} = modifiedProps

            if (texture && this.texture) {
                // TODO default material color (if not specified) when there's a
                // texture should be white

                const texture = new TextureLoader().load(this.texture, () => this.element.needsUpdate())
                this.element.three.material.map = texture
                this.element.needsUpdate()
            }
        }
    }
}

export const MaterialTexture = Mixin(MaterialTextureMixin)
export default MaterialTexture

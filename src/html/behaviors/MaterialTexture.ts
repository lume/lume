import {Mixin, MixinResult, Constructor} from 'lowclass'
import {TextureLoader, MeshPhongMaterial} from 'three'
// import WithUpdate from '../WithUpdate'
import BaseMeshBehavior, {MeshComponentType} from './BaseMeshBehavior'
import {Mesh} from '../../core'
import {reactive, attribute, autorun} from '../../core/Component'

/**
 * Mixin class for adding textures to a mesh behavior
 */
function MaterialTextureMixin<T extends Constructor<BaseMeshBehavior>>(Base: T) {
    // TODO, use a Pick<> of HTMLElement instead, pick just parts WithUpdate needs.
    // class MaterialTexture extends WithUpdate.mixin(Constructor<BaseMeshBehavior>(Base)) {
    class MaterialTexture extends Constructor<BaseMeshBehavior>(Base) {
        type: MeshComponentType = 'material'

        // static props = {
        //     ...((Base as any).props || {}),
        //     texture: String,
        // }
        // texture!: string

        @reactive
        @attribute
        texture = ''
        static tmp_props = {texture: true, ...(Base as any).tmp_props}
        async attributeChangedCallback(attr: string, oldVal: string | null, newVal: string | null) {
            super.attributeChangedCallback(attr, oldVal, newVal)
            if (attr === 'texture') {
                this[attr] = newVal as any
            }
        }
        loadGL() {
            if (!super.loadGL()) return false
            autorun(() => {
                if (this.texture) {
                    // TODO default material color (if not specified) when there's a
                    // texture should be white

                    const texture = new TextureLoader().load(this.texture, () => this.element.needsUpdate())

                    // "as MeshPhongMaterial" needed because we don't know what
                    // material it will be, and Material base class doesn't have
                    // `map`., but most other materrials do. So this shows
                    // intent, and we assume all materials are subclasses of
                    // Material, and have `.map`, at least for now.
                    // TODO handle material arrays
                    const mat = this.element.three.material as MeshPhongMaterial
                    mat.map = texture
                    this.element.needsUpdate()
                }
            })
            return true
        }

        element!: Mesh

        // constructor(el: Mesh) {
        //     super(el)
        //     this.element = el
        // }

        // updated(oldProps: any, modifiedProps: any) {
        //     super.updated && super.updated(oldProps, modifiedProps)

        //     const {texture} = modifiedProps

        //     if (texture && this.texture) {
        //         // TODO default material color (if not specified) when there's a
        //         // texture should be white

        //         const texture = new TextureLoader().load(this.texture, () => this.element.needsUpdate())

        //             // "as MeshPhongMaterial" needed because we don't know what
        //             // material it will be, and Material base class doesn't have
        //             // `map`., but most other materrials do. So this shows
        //             // intent, and we assume all materials are subclasses of
        //             // Material, and have `.map`, at least for now.
        //             // TODO handle material arrays
        //         ;(this.element.three.material as MeshPhongMaterial).map = texture
        //         this.element.needsUpdate()
        //     }
        // }
    }

    return MaterialTexture as MixinResult<typeof MaterialTexture, T>
}

export const MaterialTexture = Mixin(MaterialTextureMixin)
export interface MaterialTexture extends InstanceType<typeof MaterialTexture> {}
export default MaterialTexture

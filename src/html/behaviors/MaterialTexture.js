import Class from 'lowclass'
import { TextureLoader } from 'three'
import Mixin from '../../core/Mixin'
import { props } from '../../core/props'

// base class for geometry behaviors
export default Mixin(Base => {
    return Class( 'MaterialTexture' ).extends( Base, ({ Super }) => ({

        static: {
            props: {
                ...(Base.props || {}),
                texture: String,
            },
        },

        updated( oldProps, oldState, modifiedProps ) {
            Super(this).updated && Super(this).updated( oldProps, oldState, modifiedProps )

            const {texture} = modifiedProps

            if (texture && this.texture) {

                // TODO default material color (if not specified) when there's a
                // texture should be white

                const texture = new TextureLoader().load( this.texture, () => this.element._needsToBeRendered() )
                this.element.three.material.map = texture
                this.element._needsToBeRendered()

            }
        },

    }))
})

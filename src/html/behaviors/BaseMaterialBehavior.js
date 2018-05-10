import BaseMeshBehavior from './BaseMeshBehavior'
import { TextureLoader } from 'three'

// base class for geometry behaviors
export default
class BaseMaterialBehavior extends BaseMeshBehavior {

    static get type() { return 'material' }

    static get observedAttributes() {
        return [
            'color',
            'material-opacity',
            'map',
        ]
    }

    // TODO: generic type system for attributes.
    async attributeChangedCallback( element, attr, oldVal, newVal ) {
        if (! ( await super.attributeChangedCallback( element ) ) ) return

        if ( attr == 'color' ) {
            this.processColorValue( newVal, element.threeObject3d.material )
            element._needsToBeRendered()
        }

        // Note, Node elements also react to this, and apply it to the DOM
        // elements.
        // TODO: it'd be nice to implement a sort of opacity that multiplies
        // down the tree. We need something good enough for now.  We'll make
        // the plain "opacity" attribute be the multiplicative hierarchical
        // opacity, while material-opacity could be just for the material.
        // Material opacity would be multiplied to the hierarchical opacity.
        else if ( attr == 'material-opacity' ) {

            const material = element.threeObject3d.material
            this.processNumberValue( 'opacity', newVal, material )
            const opacity = material.opacity

            if ( opacity < 1 ) material.transparent = true
            else material.transparent = false

            element._needsToBeRendered()

        }

        else if ( attr == 'map' ) {

            // TODO: default material color (if not specified) when there's a texture should be white

            console.log('set map')
            const material = element.threeObject3d.material
            const texture = new TextureLoader().load( newVal, () => element._needsToBeRendered() )
            material.map = texture
            element._needsToBeRendered()

        }

        // we can make a lot more attributes as needed...

    }
}

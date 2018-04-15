import BaseMeshBehavior from './BaseMeshBehavior'
import { Color } from 'three'
import Class from 'lowclass'

// base class for geometry behaviors
export default
Class( 'BaseMaterialBehavior' ).extends( BaseMeshBehavior, ({ Super }) => ({

    static: {
        type: 'material',
        observedAttributes: [ 'color', 'material-opacity' ],
    },

    // TODO: generic type system for attributes.
    async attributeChangedCallback( element, attr, oldVal, newVal ) {
        if (! ( await Super(this).attributeChangedCallback( element ) ) ) return

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

        // we can make a lot more attributes as needed...

    },
}))

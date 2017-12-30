import BaseMeshBehavior from './BaseMeshBehavior'
import { Color } from 'three'

// base class for geometry behaviors
export default
class BaseMaterialBehavior extends BaseMeshBehavior {

    static get type() { return 'material' }

    static get observedAttributes() {
        return [ 'color', 'material-opacity' ]
    }

    async attributeChangedCallback( element, attr, oldVal, newVal ) {
        if (! ( await super.attributeChangedCallback( element ) ) ) return

        if ( attr == 'color' ) {

            // TODO: generic type system for attributes. It will eliminate
            // duplication in many places (f.e. see duplicated code in
            // PointLight class).

            // if a triplet space-separated of RGB numbers
            if ( newVal.match( /^\s*\d+\s+\d+\s+\d+\s*$/ ) ) {
                newVal = newVal.trim().split( /\s+/ ).map( n => parseFloat(n)/255 )
                element.threeObject3d.material.color = new Color( ...newVal )
            }
            // otherwise a CSS-style color string
            else {
                element.threeObject3d.material.color = new Color( newVal )
            }

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

    }
}

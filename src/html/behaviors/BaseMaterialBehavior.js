import BaseMeshBehavior from './BaseMeshBehavior'
import { Color } from 'three'

// base class for geometry behaviors
export default
class BaseMaterialBehavior extends BaseMeshBehavior {

    static get type() { return 'material' }

    static get observedAttributes() {
        return [ 'color' ]
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
    }

}

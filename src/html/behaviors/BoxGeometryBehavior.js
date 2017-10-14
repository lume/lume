import './HasAttribute'
import { BoxGeometry } from 'three'
import BaseMeshBehavior from './BaseMeshBehavior'

export default
class BoxGeometryBehavior extends BaseMeshBehavior {
    static get observedAttributes() {
        return [ 'size' ]
    }

    async connectedCallback( element ) {
        if ( ! await this.checkElementIsMesh( element ) ) return

        this.setMeshComponent( element, 'geometry', new BoxGeometry(
            element.calculatedSize.x,
            element.calculatedSize.y,
            element.calculatedSize.z
        ) )
        element._needsToBeRendered()
    }

    async disconnectedCallback( element ) {
        if ( ! await this.checkElementIsMesh( element ) ) return

        this.setDefaultComponent( element, 'geometry' )
        element._needsToBeRendered()
    }

    // TODO
    attributeChangedCallback(element, attr, oldValue, newValue) {
        if ( attr == 'size' ) {
            this.setMeshComponent( element, 'geometry', new BoxGeometry(
                element.calculatedSize.x,
                element.calculatedSize.y,
                element.calculatedSize.z,
            ) )

            // not needed because triggered by the attributeChangedCallback of the element.
            //element._needsToBeRendered()
        }
    }
}

elementBehaviors.define('box-geometry', BoxGeometryBehavior)

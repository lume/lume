import './HasAttribute'
import { BoxGeometry } from 'three'
import BaseMeshBehavior from './BaseMeshBehavior'

export default
class BoxGeometryBehavior extends BaseMeshBehavior {
    static get observedAttributes() {
        return [ 'size' ]
    }

    async connectedCallback( element ) {
        if ( ! this.checkedElementIsMesh ) await this.checkElementIsMesh(element)
        if ( ! this.elementIsMesh ) return

        this.setMeshComponent( element, 'geometry', new BoxGeometry(
            element.calculatedSize.x,
            element.calculatedSize.y,
            element.calculatedSize.z
        ) )
        element._needsToBeRendered()
    }

    async disconnectedCallback( element ) {
        if ( ! this.checkedElementIsMesh ) await this.checkElementIsMesh(element)
        if ( ! this.elementIsMesh ) return

        this.setDefaultComponent( element, 'geometry' )
        element._needsToBeRendered()
    }

    async attributeChangedCallback(element, attr, oldValue, newValue) {
        if ( ! this.checkedElementIsMesh ) await this.checkElementIsMesh(element)
        if ( ! this.elementIsMesh ) return

        if ( attr == 'size' ) {
            this.setMeshComponent( element, 'geometry', new BoxGeometry(
                element.calculatedSize.x,
                element.calculatedSize.y,
                element.calculatedSize.z,
            ) )

            // not needed because triggered by the attributeChangedCallback of the element for the 'size' attribute.
            //element._needsToBeRendered()
        }
    }
}

elementBehaviors.define('box-geometry', BoxGeometryBehavior)

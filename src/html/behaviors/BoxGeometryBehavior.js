import './HasAttribute'
import { BoxGeometry, Geometry } from 'three'
import BaseMeshBehavior from './BaseMeshBehavior'

export default
class BoxGeometryBehavior extends BaseMeshBehavior {
    async connectedCallback( element ) {
        if ( ! await this.checkElementIsMesh(element) ) return

        this.setMeshComponent( element, 'geometry', new BoxGeometry(1, 1, 1) )
        element._needsToBeRendered()
    }

    async disconnectedCallback( element ) {
        if ( ! await this.checkElementIsMesh(element) ) return

        this.setDefaultComponent( element, 'geometry' )
        element._needsToBeRendered()
    }

    // TODO
    attributeChangedCallback() {
        // set size, etc.
    }
}

elementBehaviors.define('box-geometry', BoxGeometryBehavior)

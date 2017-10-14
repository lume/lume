import './HasAttribute'
import { MeshBasicMaterial } from 'three'
import BaseMeshBehavior from './BaseMeshBehavior'

export default
class BasicMaterialBehavior extends BaseMeshBehavior {
    async connectedCallback( element ) {
        if ( ! await this.checkElementIsMesh(element) ) return

        this.setMeshComponent(element, 'material', new MeshBasicMaterial({ color: 0x00ff00 }))
        element._needsToBeRendered()
    }

    async disconnectedCallback( element ) {
        if ( ! await this.checkElementIsMesh(element) ) return

        this.setDefaultComponent(element, 'material')
        element._needsToBeRendered()
    }

    // TODO
    attributeChangedCallback() {
        // set color, etc.
    }
}

elementBehaviors.define('basic-material', BasicMaterialBehavior)

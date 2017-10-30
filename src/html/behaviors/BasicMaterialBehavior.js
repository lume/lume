import './HasAttribute'
import { MeshBasicMaterial, Color } from 'three'
import BaseMeshBehavior from './BaseMeshBehavior'

export default
class BasicMaterialBehavior extends BaseMeshBehavior {
    static get observedAttributes() {
        return [ 'color' ]
    }

    async connectedCallback( element ) {
        if ( ! this.checkedElementIsMesh ) await this.checkElementIsMesh(element)
        if ( ! this.elementIsMesh ) return

        this.setMeshComponent(element, 'material', new MeshBasicMaterial({ color: 0x00ff00 }))
        element._needsToBeRendered()
    }

    async disconnectedCallback( element ) {
        if ( ! this.checkedElementIsMesh ) await this.checkElementIsMesh(element)
        if ( ! this.elementIsMesh ) return

        this.setDefaultComponent(element, 'material')
        element._needsToBeRendered()
    }

    // TODO: duplicate attribute code between material behaviors, consolidate
    async attributeChangedCallback(element, attr, oldVal, newVal) {
        if ( ! this.checkedElementIsMesh ) await this.checkElementIsMesh(element)
        if ( ! this.elementIsMesh ) return

        if ( attr == 'color' ) {

            // TODO: generic type system for attributes. It will eliminate
            // duplication here (see duplicated code in PointLight class).

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

elementBehaviors.define('basic-material', BasicMaterialBehavior)

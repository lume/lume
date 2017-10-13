import './HasAttribute'
import { SphereGeometry, Geometry } from 'three'
import BaseMeshBehavior from './BaseMeshBehavior'

export default
class SphereGeometryBehavior extends BaseMeshBehavior {
    static get observedAttributes() {
        // TODO: update when we change to `size` attribute.
        return [ 'size' ]
    }

    async connectedCallback( element ) {
        if ( ! await this.checkElementIsMesh(element) ) return

        // TODO might have to defer so that calculatedSize is already calculated
        this.initialSize = element.calculatedSize // determines sphere diameter
        console.log(' @@@@@ SphereGeometryBehavior initialSize', this.initialSize)
        this.setMeshComponent( element, 'geometry', new SphereGeometry( this.initialSize.x / 2, 32, 32 ) )
        element._needsToBeRendered()
    }

    async disconnectedCallback( element ) {
        if ( ! await this.checkElementIsMesh(element) ) return

        this.setDefaultComponent( element, 'geometry' )
        element._needsToBeRendered()
    }

    // TODO
    attributeChangedCallback(element, attr, oldValue, newValue) {
        console.log(' ---- SphereGeometryBehavior attributeChangedCallback', attr, oldValue, newValue)

        if ( attr == 'size' ) {
            // TODO We currently don't rely on the actual attribute values, but
            // on the calculatedSize that is calculated by the Sizeable class that
            // element extends from. This might not be accurate in the future
            // if we defer size calculations to the next animation frame.
            // Maybe we can make it force calculation in these cases, similar
            // to how DOM does forced layout when forced. Or maybe, when/if we
            // have attribute typing, we just react to actual typed attribute
            // values. In either case, the end user should avoid changing
            // attribute values until an animation frame, so that no matter
            // what everything happens in sync with the browser rendering.
            // TODO: if the current calculatedSize is calculated *after* this code,
            // then we may need to defer to a microtask. Let's see in which
            // order it is happening...
            // TODO: how does scaling affect textures? Maybe we have to scale
            // textures, or maybe we have to just generate a new Sphere? Or
            // maybe we can hack it and somehow modify the existing geometry to
            // Three sees it as having a new size.
            const scale = element.calculatedSize.x / this.initialSize.x
            element.threeObject3d.scale.x = scale
            element.threeObject3d.scale.y = scale
            element.threeObject3d.scale.z = scale

            // not needed because triggered by the attributeChangedCallback of the element.
            //element._needsToBeRendered()
        }
    }
}

elementBehaviors.define('sphere-geometry', SphereGeometryBehavior)

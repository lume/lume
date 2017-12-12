import BaseMeshBehavior from './BaseMeshBehavior'

// base class for geometry behaviors
export default
class BaseGeometryBehavior extends BaseMeshBehavior {

    static get type() { return 'geometry' }

    static get observedAttributes() {
        return [ 'size' ]
    }

    async attributeChangedCallback( element, attr, oldVal, newVal ) {
        if (! ( await super.attributeChangedCallback( element ) ) ) return

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
            // maybe we can hack it and somehow modify the existing geometry so
            // Three sees it as having a new size.

            this.setMeshComponent( element, 'geometry', this.createComponent(element) )

            // this is not needed because it is already triggered by the
            // attributeChangedCallback of the element for the 'size'
            // attribute.
            //element._needsToBeRendered()
        }
    }

}

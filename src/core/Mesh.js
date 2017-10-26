import Node from './Node'

import {
    BoxGeometry,
    MeshBasicMaterial,
    Mesh as ThreeMesh,
} from 'three'

// register behaviors that can be used with this class.
import '../html/behaviors/BasicMaterialBehavior'
import '../html/behaviors/PhongMaterialBehavior'
import '../html/behaviors/BoxGeometryBehavior'
import '../html/behaviors/SphereGeometryBehavior'

// TODO get these from somewhere dynamically, obvsiouly.
// Perhaps there will be an API for registering geometries and
// materials.
const geometryBehaviorNames = [
    'box-geometry',
    'sphere-geometry',
]
const materialBehaviorNames = [
    'basic-material',
    'phong-material',
]

// TODO:
// - API for registering new behaviors as they pertain to our API, built on top
//   of element-behaviors.
// - Ability specify default initial behaviors. Make this generic, or on top of
//   element-behaviors?
// - generic ability to specify custom element attribute types, as an addon to
//   Custom Elements. We can use the same mechanism to specify types for behaviors too?

export default
class Mesh extends Node {
    static get defaultElementName() { return 'i-mesh' }
    static get _Class() { return Mesh }

    construct( options = {} ) {
        super.construct(options)

        // MOVE
        // If no geometry or material behavior is detected, add default ones.
        //
        // Deferring to a microtask doesn't work here, we must defer to a
        // macrotask with setTimeout, so we can detect if the element has
        // initial behaviors, otherwise the element's initial attributes
        // haven't been added yet (this is how HTML engines work, see
        // https://github.com/whatwg/dom/issues/522).
        //
        // TODO: If we use setTimeout (macrotask) deferral anywhere (like we do
        // here), and maybe even with microtask deferral (f.e. Promise), maybe
        // we should have a single place that initiate this deferral so that
        // everything in the engine can hook into it. Otherwise if different
        // call sites use setTimeout, logic will be firing at random and in
        // different order.
        setTimeout( () => this.setDefaultBehaviorsIfNeeded(), 0 )
    }

    // MOVE
    async setDefaultBehaviorsIfNeeded() {
        const initialBehaviors = Array.from( this.behaviors.keys() )

        // small optimization: if there are no values, obviously we don't
        // have a geometry or material, just make them
        if ( initialBehaviors.length == 0 ) {
            this.setAttribute( 'has', this.getAttribute( 'has' ) + ' box-geometry phong-material' )
        }
        // otherwise detect which behavior(s) to add
        else {

            let hasGeometry = false
            let hasMaterial = false

            for ( const behavior of initialBehaviors ) {
                if ( geometryBehaviorNames.includes( behavior) ) hasGeometry = true
                if ( materialBehaviorNames.includes( behavior) ) hasMaterial = true
            }

            // small optimization?: set both behaviors at once if we can.
            if ( ! hasGeometry && ! hasMaterial ) {
                // TODO programmatic API:
                //this.behaviors.add('box-geometry')

                this.setAttribute( 'has', this.getAttribute( 'has' ) + ' box-geometry phong-material' )
                return
            }

            if ( ! hasGeometry ) {
                // TODO programmatic API:
                //this.behaviors.add('box-geometry')

                this.setAttribute( 'has', this.getAttribute( 'has' ) + ' box-geometry' )
            }

            if ( ! hasMaterial ) {
                // TODO programmatic API:
                //this.behaviors.add('phong-material')

                this.setAttribute( 'has', this.getAttribute( 'has' ) + ' phong-material' )
            }
        }

    }

    initWebGl() {
        super.initWebGl()
    }

    makeThreeObject3d() {
        return new ThreeMesh
    }
}

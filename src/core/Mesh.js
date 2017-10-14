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

export default
class Mesh extends Node {
    static get defaultElementName() { return 'i-mesh' }
    static get _Class() { return Mesh }

    construct( options = {} ) {
        super.construct(options)

        // THREE
        // TODO if no geometry or material behavior is detected, add default ones.
    }

    initWebGl() {

        // defaults
        // TODO: make these getters/setters for the associated behaviors?
        // TODO: remove defaults from here, they're defined in the behaviors.
        if (!this.geometry) this.geometry = new BoxGeometry( 1, 1, 1 )
        if (!this.material) this.material = new MeshBasicMaterial( { color: 0x00ff00 } )

        super.initWebGl()
    }

    makeThreeObject3d() {
        return new ThreeMesh
    }
}

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

    static get defaultBehaviors() {
        return [
            'box-geometry',
            'phong-material',
        ]
    }

    makeThreeObject3d() {
        return new ThreeMesh
    }
}

import Node from './Node'

import { Mesh as ThreeMesh } from 'three'

// register behaviors that can be used with this class.
// TODO: maybe useDefaultNames() should register these, otherwise the user can
// choose names for better flexibility. See TODO NAMING below.
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

    // TODO NAMING: It would be neat to be able to return an array of classes
    // as well, so that it can be agnostic of the naming. Either way should
    // work.
    static get defaultBehaviors() {
        return {
            'box-geometry': initialBehaviors => {
                return !initialBehaviors.some( b => b.endsWith( '-geometry' ) )
            },
            'phong-material': initialBehaviors => {
                return !initialBehaviors.some( b => b.endsWith( '-material' ) )
            },
        }
    }

    makeThreeObject3d() {
        return new ThreeMesh
    }
}

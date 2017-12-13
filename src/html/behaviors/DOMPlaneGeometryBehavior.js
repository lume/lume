import './HasAttribute'
import { BoxGeometry } from 'three'
import BaseGeometryBehavior from './BaseGeometryBehavior'

export default
class DOMPlaneGeometryBehavior extends BaseGeometryBehavior {

    createComponent(element) {

        // We have to use a BoxGeometry instead of a
        // PlaneGeometry because Three.js is not capable of
        // casting shadows from Planes, at least until we find
        // another way. Unfortunately, this increases polygon
        // count by a factor of 6. See issue
        // https://github.com/mrdoob/three.js/issues/9315
        return new BoxGeometry(
            element.calculatedSize.x,
            element.calculatedSize.y,
            1
        )

    }

}

elementBehaviors.define('domplane-geometry', DOMPlaneGeometryBehavior)

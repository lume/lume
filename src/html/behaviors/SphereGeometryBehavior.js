import 'element-behaviors'
import { SphereGeometry } from 'three'
import BaseGeometryBehavior from './BaseGeometryBehavior'

export default
class SphereGeometryBehavior extends BaseGeometryBehavior {

    createComponent(element) {
        return new SphereGeometry(
            element.calculatedSize.x / 2,
            32,
            32
        )
    }

}

elementBehaviors.define('sphere-geometry', SphereGeometryBehavior)

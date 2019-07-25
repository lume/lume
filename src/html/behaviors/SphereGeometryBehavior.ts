import 'element-behaviors'
import {SphereGeometry} from 'three'
import BaseGeometryBehavior from './BaseGeometryBehavior'

export default class SphereGeometryBehavior extends BaseGeometryBehavior {
    protected _createComponent() {
        // TODO props for modifying number of subdivisions
        return new SphereGeometry(this.element.calculatedSize.x / 2, 32, 32)
    }
}

elementBehaviors.define('sphere-geometry', SphereGeometryBehavior)

export {SphereGeometryBehavior}

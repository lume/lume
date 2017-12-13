import './HasAttribute'
import { PlaneGeometry } from 'three'
import BaseGeometryBehavior from './BaseGeometryBehavior'

export default
class PlaneGeometryBehavior extends BaseGeometryBehavior {

    createComponent(element) {
        return new PlaneGeometry(
            element.calculatedSize.x,
            element.calculatedSize.y,
        )
    }

}

elementBehaviors.define('plane-geometry', PlaneGeometryBehavior)

import './HasAttribute'
import { BoxGeometry } from 'three'
import BaseGeometryBehavior from './BaseGeometryBehavior'

export default
class BoxGeometryBehavior extends BaseGeometryBehavior {

    createComponent(element) {
        return new BoxGeometry(
            element.calculatedSize.x,
            element.calculatedSize.y,
            element.calculatedSize.z
        )
    }

}

elementBehaviors.define('box-geometry', BoxGeometryBehavior)

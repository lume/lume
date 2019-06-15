import 'element-behaviors'
import {BoxGeometry} from 'three'
import BaseGeometryBehavior from './BaseGeometryBehavior'

const BoxGeometryBehavior = BaseGeometryBehavior.subclass('BoxGeometryBehavior', Public => ({
    protected: {
        _createComponent() {
            return new BoxGeometry(
                Public(this).element.calculatedSize.x,
                Public(this).element.calculatedSize.y,
                Public(this).element.calculatedSize.z
            )
        },
    },
}))

elementBehaviors.define('box-geometry', BoxGeometryBehavior)

export default BoxGeometryBehavior

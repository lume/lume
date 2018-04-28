import 'element-behaviors'
import { BoxGeometry } from 'three'
import BaseGeometryBehavior from './BaseGeometryBehavior'

const BoxGeometryBehavior = BaseGeometryBehavior.subclass('BoxGeometryBehavior', {

    protected: {

        createComponent(element) {
            return new BoxGeometry(
                element.calculatedSize.x,
                element.calculatedSize.y,
                element.calculatedSize.z
            )
        },

    },

})

elementBehaviors.define('box-geometry', BoxGeometryBehavior)

export default BoxGeometryBehavior

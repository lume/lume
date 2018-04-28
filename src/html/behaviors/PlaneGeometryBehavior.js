import 'element-behaviors'
import { PlaneGeometry } from 'three'
import BaseGeometryBehavior from './BaseGeometryBehavior'

const PlaneGeometryBehavior = BaseGeometryBehavior.subclass('PlaneGeometryBehavior', {

    protected: {

        createComponent(element) {
            return new PlaneGeometry(
                element.calculatedSize.x,
                element.calculatedSize.y,
            )
        },

    },

})

elementBehaviors.define('plane-geometry', PlaneGeometryBehavior)

export default PlaneGeometryBehavior

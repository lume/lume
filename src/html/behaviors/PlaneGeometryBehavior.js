import 'element-behaviors'
import { PlaneGeometry } from 'three'
import BaseGeometryBehavior from './BaseGeometryBehavior'

const PlaneGeometryBehavior = BaseGeometryBehavior.subclass('PlaneGeometryBehavior', (Public) => ({

    protected: {

        createComponent() {
            return new PlaneGeometry(
                Public(this).element.calculatedSize.x,
                Public(this).element.calculatedSize.y,
            )
        },

    },

}))

elementBehaviors.define('plane-geometry', PlaneGeometryBehavior)

export default PlaneGeometryBehavior

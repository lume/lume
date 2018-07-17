import 'element-behaviors'
import { SphereGeometry } from 'three'
import BaseGeometryBehavior from './BaseGeometryBehavior'

const SphereGeometryBehavior = BaseGeometryBehavior.subclass('SphereGeometryBehavior', (Public) => ({

    protected: {

        createComponent() {
            return new SphereGeometry(
                Public(this).element.calculatedSize.x / 2,
                32,
                32
            )
        },

    },

}))

elementBehaviors.define('sphere-geometry', SphereGeometryBehavior)

export default SphereGeometryBehavior

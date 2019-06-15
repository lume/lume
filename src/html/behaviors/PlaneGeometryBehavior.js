import 'element-behaviors'
import {PlaneGeometry} from 'three'
import BaseGeometryBehavior from './BaseGeometryBehavior'

const PlaneGeometryBehavior = BaseGeometryBehavior.subclass('PlaneGeometryBehavior', Public => ({
    protected: {
        _createComponent() {
            return new PlaneGeometry(this.element.calculatedSize.x, this.element.calculatedSize.y)
        },
    },
}))

elementBehaviors.define('plane-geometry', PlaneGeometryBehavior)

export default PlaneGeometryBehavior

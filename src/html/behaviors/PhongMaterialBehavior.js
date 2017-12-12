import './HasAttribute'
import { MeshPhongMaterial } from 'three'
import BaseMaterialBehavior from './BaseMaterialBehavior'

export default
class PhongMaterialBehavior extends BaseMaterialBehavior {

    createComponent(element) {
        return new MeshPhongMaterial({ color: 0x00ff00 })
    }

}

elementBehaviors.define('phong-material', PhongMaterialBehavior)

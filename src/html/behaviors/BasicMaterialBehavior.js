import './HasAttribute'
import { MeshBasicMaterial } from 'three'
import BaseMaterialBehavior from './BaseMaterialBehavior'

export default
class BasicMaterialBehavior extends BaseMaterialBehavior {

    createComponent(element) {
        return new MeshBasicMaterial({ color: 0x00ff00 })
    }

}

elementBehaviors.define('basic-material', BasicMaterialBehavior)

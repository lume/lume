import 'element-behaviors'
import { MeshBasicMaterial } from 'three'
import BaseMaterialBehavior from './BaseMaterialBehavior'

const BasicMaterialBehavior = BaseMaterialBehavior.subclass('BasicMaterialBehavior', {

    protected: {

        _createComponent() {
            return new MeshBasicMaterial({ color: 0x00ff00 })
        },

    },

})

elementBehaviors.define('basic-material', BasicMaterialBehavior)

export default BasicMaterialBehavior

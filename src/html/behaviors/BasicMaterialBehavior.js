import Class from 'lowclass'
import 'element-behaviors'
import { MeshBasicMaterial } from 'three'
import BaseMaterialBehavior from './BaseMaterialBehavior'
import MaterialTexture from './MaterialTexture'

const BasicMaterialBehavior = Class('BasicMaterialBehavior').extends(MaterialTexture.mixin(BaseMaterialBehavior), {

    protected: {

        _createComponent() {
            return new MeshBasicMaterial({ color: 0x00ff00 })
        },

    },

})

elementBehaviors.define('basic-material', BasicMaterialBehavior)

export default BasicMaterialBehavior

import Class from 'lowclass'
import 'element-behaviors'
import {MeshPhongMaterial} from 'three'
import BaseMaterialBehavior from './BaseMaterialBehavior'
import MaterialTexture from './MaterialTexture'

const PhongMaterialBehavior = Class('PhongMaterialBehavior').extends(MaterialTexture.mixin(BaseMaterialBehavior), {
    protected: {
        _createComponent() {
            return new MeshPhongMaterial({color: 0x00ff00})
        },
    },
})

elementBehaviors.define('phong-material', PhongMaterialBehavior)

export default PhongMaterialBehavior

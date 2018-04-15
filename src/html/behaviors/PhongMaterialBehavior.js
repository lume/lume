import 'element-behaviors'
import { MeshPhongMaterial } from 'three'
import BaseMaterialBehavior from './BaseMaterialBehavior'

const PhongMaterialBehavior = BaseMaterialBehavior.subclass({

    protected: {

        createComponent(element) {
            return new MeshPhongMaterial({ color: 0x00ff00 })
        },

    },

})

elementBehaviors.define('phong-material', PhongMaterialBehavior)

export default PhongMaterialBehavior

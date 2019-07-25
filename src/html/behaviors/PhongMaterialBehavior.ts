import 'element-behaviors'
import {MeshPhongMaterial} from 'three'
import BaseMaterialBehavior from './BaseMaterialBehavior'
import MaterialTexture from './MaterialTexture'

export default class PhongMaterialBehavior extends MaterialTexture.mixin(BaseMaterialBehavior) {
    protected _createComponent() {
        return new MeshPhongMaterial({
            color: 0x00ff00,
            side: this.side,
            shadowSide: this.shadowSide,
        } as any)
    }
}

elementBehaviors.define('phong-material', PhongMaterialBehavior)

export {PhongMaterialBehavior}

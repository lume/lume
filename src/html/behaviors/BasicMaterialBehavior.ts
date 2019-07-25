import 'element-behaviors'
import {MeshBasicMaterial} from 'three'
import BaseMaterialBehavior from './BaseMaterialBehavior'
import MaterialTexture from './MaterialTexture'

export default class BasicMaterialBehavior extends MaterialTexture.mixin(BaseMaterialBehavior) {
    protected _createComponent() {
        return new MeshBasicMaterial({
            color: 0x00ff00,
            side: this.side,
            shadowSide: this.shadowSide,
        } as any)
    }
}

elementBehaviors.define('basic-material', BasicMaterialBehavior)

export {BasicMaterialBehavior}

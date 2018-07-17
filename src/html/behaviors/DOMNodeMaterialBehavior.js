import 'element-behaviors'
import { MeshPhongMaterial } from 'three'
import BaseMaterialBehavior from './BaseMaterialBehavior'
import { Color, NoBlending, /*DoubleSide*/ } from 'three'

const DOMNodeMaterialBehavior = BaseMaterialBehavior.subclass('DOMNodeMaterialBehavior', {

    protected: {

        createComponent() {
            // TODO PERFORMANCE we can re-use a single material for
            // all the DOM planes rather than a new material per
            // plane.
            return new MeshPhongMaterial({
                opacity	: 0.5,
                color	: new Color( 0x111111 ),
                blending: NoBlending,
                //side	: DoubleSide,
            })
        },

    },

})

export default DOMNodeMaterialBehavior

elementBehaviors.define('domnode-material', DOMNodeMaterialBehavior)

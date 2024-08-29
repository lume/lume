import { Element3D } from '../core/Element3D.js';
import { skeletonHelper } from '../utils/three/skeletonHelper.js';
/**
 * @class Model - Base class for model elements (f.e. `<lume-gltf-model>`, `<lume-fbx-model>`, etc)
 * @extends Element3D
 */
export class Model extends Element3D {
    connectedCallback() {
        super.connectedCallback();
        this.createEffect(() => {
            if (!this.scene)
                return;
            if (this.debug)
                skeletonHelper(this);
        });
    }
}
//# sourceMappingURL=Model.js.map
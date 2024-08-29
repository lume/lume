import { createMemo } from 'solid-js';
import { Group } from 'three/src/objects/Group.js';
import { Model } from '../Model.js';
import { createBehaviorMemo } from './createBehaviorMemo.js';
import { ModelBehavior } from '../../behaviors/index.js';
/**
 * Given a Model element, returns a signal that will contain the element's
 * loaded model (undefined until loaded). The signal also changes any time the
 * element loads a new model.
 */
export function createThreeModelMemo(modelEl) {
    const modelBehavior = createBehaviorMemo(modelEl, (name, behavior) => name.endsWith('-model') && behavior instanceof ModelBehavior);
    return createMemo(() => {
        const behavior = modelBehavior();
        if (!behavior)
            return;
        const model = behavior.model;
        if (!model)
            return;
        const root = model instanceof Group ? model : model.scene;
        const clips = 'animations' in model ? model.animations : model.scene.animations;
        return { root, clips };
    });
}
//# sourceMappingURL=createThreeModelMemo.js.map
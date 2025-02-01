import { createEffect, onCleanup } from 'solid-js';
import { SkeletonHelper } from 'three/src/helpers/SkeletonHelper.js';
import { Motor } from '../../core/Motor.js';
import { Model } from '../../models/Model.js';
import { createThreeModelMemo } from '../../models/utils/createThreeModelMemo.js';
/**
 * Adds a skeleton helper for the given Model element, and keeps it updated
 * based on obj each frame. Useful when debugging model animations.
 * If used in an effect, it will automatically clean up when the effect is
 * cleaned up. If not used in an effect, be sure to manually call the dispose
 * function.
 */
export function skeletonHelper(element) {
    const scene = element.scene;
    if (!scene)
        return;
    const threeScene = scene.three;
    const threeModel = createThreeModelMemo(element);
    createEffect(() => {
        const model = threeModel();
        if (!model)
            return;
        const { root } = model;
        const helper = new SkeletonHelper(root);
        threeScene.add(helper);
        const task = Motor.addRenderTask(() => {
            // ensure obj is updated or else the helper will be one frame behind
            root.updateWorldMatrix(true, true);
            helper.updateMatrixWorld(true);
        });
        onCleanup(() => {
            Motor.removeRenderTask(task);
            helper.dispose();
            threeScene.remove(helper);
        });
    });
}
//# sourceMappingURL=skeletonHelper.js.map
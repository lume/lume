import { CSS3DRendererNested } from './CSS3DRendererNested.js';
import { Motor } from '../core/Motor.js';
let instance = null;
let isCreatingSingleton = false;
export class Css3dRendererThree {
    static singleton() {
        if (instance)
            return instance;
        else {
            try {
                isCreatingSingleton = true;
                return (instance = new Css3dRendererThree());
            }
            catch (e) {
                throw e;
            }
            finally {
                isCreatingSingleton = false;
            }
        }
    }
    constructor() {
        if (!isCreatingSingleton)
            throw new Error('class is a singleton, use the static .singleton() method to get an instance');
    }
    sceneStates = new WeakMap();
    initialized(scene) {
        return this.sceneStates.has(scene);
    }
    // TODO rename
    initialize(scene) {
        let sceneState = this.sceneStates.get(scene);
        if (sceneState)
            return;
        this.sceneStates.set(scene, (sceneState = {
            renderer: new CSS3DRendererNested(),
        }));
        const { renderer } = sceneState;
        scene._cssLayer.appendChild(renderer.domElement);
    }
    uninitialize(scene) {
        const sceneState = this.sceneStates.get(scene);
        if (!sceneState)
            return;
        scene._cssLayer?.removeChild(sceneState.renderer.domElement);
        this.sceneStates.delete(scene);
    }
    drawScene(scene) {
        const sceneState = this.sceneStates.get(scene);
        if (!sceneState)
            throw new ReferenceError('Can not draw scene. Scene state should be initialized first.');
        const { renderer } = sceneState;
        renderer.render(scene.threeCSS, scene.threeCamera);
    }
    updateResolution(scene, x, y) {
        // We don't need to defer here like we do in the webgl renderer (see the
        // WebglRendererThree.updateResolution comment for more info on why we
        // need to defer), but we do it so that the CSS visual stays in sync
        // with the GL visual on resize, otherwise the resized CSS visual will
        // always be one frame ahead of the resized GL visual.
        Motor.once(() => {
            if (!this.initialized(scene))
                return;
            const state = this.sceneStates.get(scene);
            state.renderer.setSize(x, y);
        });
    }
    requestFrame(_scene, fn) {
        requestAnimationFrame(fn);
    }
}
export function releaseCSS3DRendererThree() {
    instance = null;
}
//# sourceMappingURL=Css3dRendererThree.js.map
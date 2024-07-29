import { Group } from 'three/src/Three.js';
import { GltfModel } from './GltfModel.js';
import { ModelLoadEvent } from './Model.js';
describe('Model', () => {
    it('dispatches a ModelLoadEvent', () => {
        const el = new GltfModel();
        // Type check
        el.addEventListener('click', function (event) {
            event.target; // standard property
        });
        // Type check
        el.addEventListener('pointerdown', function (event) {
            event.target; // standard property
        });
        let loadEvent = null;
        el.addEventListener('load', function (event) {
            event.target;
            event.format;
            event.model;
            if ('scene' in event.model)
                event.model.scene;
            this.position;
            this.rotation;
            loadEvent = event;
        });
        const event = new ModelLoadEvent('fbx', new Group());
        el.dispatchEvent(event);
        expect(loadEvent).toBe(event);
        // Type check
        const div = document.createElement('div');
        div.addEventListener('load', function (event) {
            event.target;
            // @ts-expect-error should not be a ModelLoadEvent
            event.format;
            // @ts-expect-error should not be a ModelLoadEvent
            event.model;
            // @ts-expect-error should not be a ModelLoadEvent
            this.position;
        });
    });
});
//# sourceMappingURL=Model.test.js.map
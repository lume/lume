import { Scene } from '../core/Scene.js';
import '../index.js';
import { Line } from './Line.js';
import { Line as ThreeLine } from 'three/src/objects/Line.js';
describe('Line', () => {
    const root = document.createElement('div');
    document.body.append(root);
    let scene = new Scene();
    root.append(scene);
    function newScene() {
        root.innerHTML = '';
        scene = new Scene();
        root.append(scene);
    }
    afterEach(() => {
        newScene();
    });
    it('inherits property types from behaviors, for TypeScript', async () => {
        ~class extends Line {
            test() {
                this.wireframe;
                this.sidedness;
                this.color;
                this.texture;
                this.bumpMap;
                this.specularMap;
            }
        };
    });
    it('element is an instance of Line, created with `new`', async () => {
        const n = new Line();
        scene.append(n);
        expect(n instanceof Line).toBe(true);
        expect(n.three).toBeInstanceOf(ThreeLine);
        expect(n.scene).not.toBeUndefined();
    });
    it('element is an instance of Line, created with `document.createElement`', async () => {
        const n = document.createElement('lume-line');
        scene.append(n);
        expect(n instanceof Line).toBe(true);
        expect(n.three).toBeInstanceOf(ThreeLine);
        expect(n.scene).not.toBeUndefined();
    });
});
//# sourceMappingURL=Line.test.js.map
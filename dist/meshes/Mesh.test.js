import { Scene } from '../core/Scene.js';
import '../index.js';
import { Mesh } from './Mesh.js';
import { Mesh as ThreeMesh } from 'three/src/objects/Mesh.js';
describe('Mesh', () => {
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
        ~class extends Mesh {
            test() {
                this.wireframe;
                this.sidedness;
                this.color;
                this.texture;
                this.bumpMap;
                this.specularMap;
            }
        };
        // TODO enable TSX and test JSX markup.
    });
    it('element is an instance of Mesh, created with `new`', async () => {
        const n = new Mesh();
        scene.append(n);
        expect(n instanceof Mesh).toBe(true);
        expect(n.three).toBeInstanceOf(ThreeMesh);
        expect(n.scene).not.toBeUndefined();
    });
    it('element is an instance of Mesh, created with `document.createElement`', async () => {
        const n = document.createElement('lume-mesh');
        scene.append(n);
        expect(n instanceof Mesh).toBe(true);
        expect(n.three).toBeInstanceOf(ThreeMesh);
        expect(n.scene).not.toBeUndefined();
    });
});
//# sourceMappingURL=Mesh.test.js.map
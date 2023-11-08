import { autorun } from '@lume/element';
import { Element3D } from './Element3D.js';
import { Scene } from './Scene.js';
import '../index.js';
describe('SharedAPI', () => {
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
    describe('.scene', () => {
        it('tells us what scene a node is in', async () => {
            const n = new Element3D();
            expect(n.scene).toBe(null);
            expect(scene.scene).toBe(scene);
            scene.append(n);
            let count = 0;
            const stop = autorun(() => {
                count++;
                if (count === 1)
                    expect(n.scene).toBe(null);
                else if (count === 2)
                    expect(n.scene).toBe(scene);
            });
            await Promise.resolve();
            expect(n.scene).toBe(scene);
            expect(count).toBe(2);
            stop();
            n.remove();
            expect(n.scene).toBe(null);
            newScene();
            scene.append(n);
            await Promise.resolve();
            expect(n.scene).toBe(scene);
            const scene2 = new Scene();
            root.append(scene2);
            scene2.append(n);
            await Promise.resolve();
            expect(n.scene).toBe(scene2);
            newScene();
            expect(n.scene).toBe(null);
        });
    });
});
//# sourceMappingURL=SharedAPI.test.js.map
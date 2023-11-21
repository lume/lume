import { createEffect } from 'solid-js';
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { html } from '../index.js';
describe('InstancedMesh', () => {
    let style;
    beforeAll(() => {
        style = html `
			<style>
				html,
				body {
					height: 100%;
					margin: 0;
					background: black;
				}
			</style>
		`;
        document.body.append(style);
    });
    afterAll(() => {
        style.remove();
    });
    let instanceCount = 100;
    const rotations = Array.from({ length: instanceCount * 3 }).map(() => Math.random());
    const positions = Array.from({ length: instanceCount * 3 }).map(() => 2000 * Math.random());
    const scales = Array.from({ length: instanceCount * 3 }).map(() => Math.random());
    // const colorPhases = Array.from({length: instanceCount * 3}).map(() => 2 * Math.random())
    const colors = Array.from({ length: instanceCount * 3 }).map(() => Math.random());
    const positions2 = [...positions].fill(0.1);
    const rotations2 = [...positions].fill(0.2);
    const scales2 = [...positions].fill(0.3);
    const colors2 = [...colors].fill(0.5);
    let mesh = null;
    let scene = null;
    beforeEach(() => {
        makeScene();
    });
    afterEach(() => {
        scene.remove();
    });
    function makeScene() {
        scene = html `
			<lume-scene id="scene" perspective="800" webgl>
				<lume-point-light position="2500 -2500 2500" intensity="0.6" color="white"></lume-point-light>
				<lume-ambient-light color="white" intensity="0.6"></lume-ambient-light>

				<lume-camera-rig
					active
					initial-distance="2000"
					max-distance="3000"
					min-distance="100"
					position="1000 1000 1000"
				></lume-camera-rig>

				<lume-instanced-mesh
					ref=${(el) => (mesh = el)}
					color="white"
					count=${instanceCount}
					rotations=${rotations}
					positions=${positions}
					scales=${scales}
					colors=${colors}
					size="30 30 30"
				></lume-instanced-mesh>
			</lume-scene>
		`;
        document.body.append(scene);
    }
    function verifyColors(colors) {
        expect(mesh.three.instanceColor?.array).toEqual(Float32Array.from(colors));
    }
    const mat1 = new Matrix4();
    const mat2 = new Matrix4();
    const position = new Vector3();
    const quat = new Quaternion();
    const eul = new Euler();
    const scale = new Vector3();
    const pivot = new Vector3();
    // Verifies that elements were composed from our data into the instanceMatrix buffer.
    function verifyMatrices(positions, rotations, scales) {
        for (let index = 0; index < mesh.count; index += 1) {
            mesh._calculateInstanceMatrix(position.set(positions[index * 3 + 0], positions[index * 3 + 1], positions[index * 3 + 2]), quat.setFromEuler(eul.set(rotations[index * 3 + 0], rotations[index * 3 + 1], rotations[index * 3 + 2])), scale.set(scales[index * 3 + 0], scales[index * 3 + 1], scales[index * 3 + 2]), pivot, mat1);
            mesh.three.getMatrixAt(index, mat2);
            // three.getMatrixAt gets the values from the underlying
            // Float32Array, so we need to cast ours or it will not match.
            expect(Array.from(Float32Array.from(mat1.elements))).toEqual(mat2.elements);
        }
    }
    function nextFrame() {
        return new Promise(r => requestAnimationFrame(r));
    }
    it('allows setting instanced components directly', async () => {
        expect(mesh.three.count).toBe(instanceCount);
        expect(mesh.colors.length).toBe(instanceCount * 3);
        // Updated in the next animation frame after setting the colors
        expect(mesh.three.instanceColor?.array.length).toBe(undefined);
        await nextFrame();
        verifyColors(colors);
        verifyMatrices(positions, rotations, scales);
        await nextFrame();
        mesh.colors = colors2;
        await nextFrame();
        verifyColors(colors2);
        mesh.positions = positions2;
        await nextFrame();
        verifyMatrices(positions2, rotations, scales);
        mesh.rotations = rotations2;
        await nextFrame();
        verifyMatrices(positions2, rotations2, scales);
        mesh.scales = scales2;
        await nextFrame();
        verifyMatrices(positions2, rotations2, scales2);
    });
    it('does not resize three array buffer incorrectly', async () => {
        mesh.colors = colors2;
        await nextFrame();
        let runs = 0;
        createEffect(() => {
            runs++;
            mesh.count;
        });
        expect(runs).toBe(1);
        mesh.count = 0; // effect runs again
        mesh.count = instanceCount; // effect runs again
        expect(runs).toBe(3);
        await nextFrame();
        verifyColors(colors2);
    });
    const they = it;
    describe('individual instance setters', () => {
        they('allow setting any instance transform component', async () => {
            const colors2 = [...colors];
            mesh.setInstanceColor(5, 0.1, 0.2, 0.3);
            colors2[5 * 3 + 0] = 0.1;
            colors2[5 * 3 + 1] = 0.2;
            colors2[5 * 3 + 2] = 0.3;
            await nextFrame();
            verifyColors(colors2);
            const positions2 = [...positions];
            mesh.setInstancePosition(5, 1, 2, 3);
            positions2[5 * 3 + 0] = 1;
            positions2[5 * 3 + 1] = 2;
            positions2[5 * 3 + 2] = 3;
            await nextFrame();
            verifyMatrices(positions2, rotations, scales);
            const rotations2 = [...rotations];
            mesh.setInstanceRotation(5, 1, 2, 3);
            rotations2[5 * 3 + 0] = 1;
            rotations2[5 * 3 + 1] = 2;
            rotations2[5 * 3 + 2] = 3;
            await nextFrame();
            verifyMatrices(positions2, rotations2, scales);
            const scales2 = [...scales];
            mesh.setInstanceScale(5, 1, 2, 3);
            scales2[5 * 3 + 0] = 1;
            scales2[5 * 3 + 1] = 2;
            scales2[5 * 3 + 2] = 3;
            await nextFrame();
            verifyMatrices(positions2, rotations2, scales2);
        });
        they('do not cause an infinite reactivity loop', async () => {
            let runs = 0;
            let runs2 = 0;
            createEffect(() => {
                runs++;
                // These were previously causing an infinite reactivity loop.
                mesh.setInstancePosition(0, 0, 0.5, 1);
                mesh.setInstanceRotation(0, 0, 0.5, 1);
                mesh.setInstanceScale(0, 0, 0.5, 1);
                mesh.setInstanceColor(0, 0, 0.5, 1);
            });
            createEffect(() => {
                runs2++;
                mesh.positions;
                mesh.rotations;
                mesh.scales;
                mesh.colors;
            });
            expect(runs).toBe(1);
            expect(runs2).toBe(1);
            mesh.setInstanceRotation(10, 0, 0.5, 1);
            mesh.setInstancePosition(10, 0, 0.5, 1);
            mesh.setInstanceScale(10, 0, 0.5, 1);
            mesh.setInstanceColor(10, 0, 0.5, 1);
            await Promise.resolve();
            expect(runs).toBe(1);
            expect(runs2).toBe(5);
            mesh.setInstanceRotation(15, 0, 0.5, 1);
            mesh.setInstancePosition(15, 0, 0.5, 1);
            mesh.setInstanceScale(15, 0, 0.5, 1);
            mesh.setInstanceColor(15, 0, 0.5, 1);
            await Promise.resolve();
            expect(runs).toBe(1);
            expect(runs2).toBe(9);
        });
    });
});
//# sourceMappingURL=InstancedMesh.test.js.map
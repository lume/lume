var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { batch, untrack } from 'solid-js';
import { element, numberAttribute, stringAttribute } from '@lume/element';
import { InstancedMesh as ThreeInstancedMesh } from 'three/src/objects/InstancedMesh.js';
import { BoxGeometry } from 'three/src/geometries/BoxGeometry.js';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial.js';
import { DynamicDrawUsage } from 'three/src/constants.js';
import { Quaternion } from 'three/src/math/Quaternion.js';
import { Vector3 } from 'three/src/math/Vector3.js';
import { Color } from 'three/src/math/Color.js';
import { Matrix4 } from 'three/src/math/Matrix4.js';
import { Euler } from 'three/src/math/Euler.js';
import { Mesh } from './Mesh.js';
import { autoDefineElements } from '../LumeConfig.js';
import { stringToNumberArray } from './utils.js';
import { queueMicrotaskOnceOnly } from '../utils/queueMicrotaskOnceOnly.js';
const _quat = new Quaternion();
const _pos = new Vector3();
const _scale = new Vector3();
const _pivot = new Vector3();
const _mat = new Matrix4();
const _rot = new Euler();
const _color = new Color();
const appliedPosition = [0, 0, 0];
let InstancedMesh = class InstancedMesh extends Mesh {
    count = 10;
    #biggestCount = this.count;
    get rotations() {
        return this.#rotations;
    }
    set rotations(v) {
        this.#rotations = stringToNumberArray(v, 'rotations');
    }
    #rotations = [];
    get positions() {
        return this.#positions;
    }
    set positions(v) {
        this.#positions = stringToNumberArray(v, 'positions');
    }
    #positions = [];
    get scales() {
        return this.#scales;
    }
    set scales(v) {
        this.#scales = stringToNumberArray(v, 'scales');
    }
    #scales = [];
    get colors() {
        return this.#colors;
    }
    set colors(v) {
        this.#colors = stringToNumberArray(v, 'colors');
    }
    #colors = [];
    static defaultBehaviors = {
        'box-geometry': (initialBehaviors) => {
            return !initialBehaviors.some((b) => b.endsWith('-geometry'));
        },
        'phong-material': (initialBehaviors) => {
            return !initialBehaviors.some((b) => b.endsWith('-material'));
        },
    };
    makeThreeObject3d() {
        let geometryBehavior = null;
        let materialBehavior = null;
        for (const [name, behavior] of this.behaviors) {
            if (name.endsWith('-geometry'))
                geometryBehavior = behavior;
            else if (name.endsWith('-material'))
                materialBehavior = behavior;
        }
        const mesh = new ThreeInstancedMesh(geometryBehavior?.meshComponent || new BoxGeometry(), materialBehavior?.meshComponent || new MeshPhongMaterial(), this.#biggestCount);
        mesh.instanceMatrix.setUsage(DynamicDrawUsage);
        const original = mesh.setColorAt;
        mesh.setColorAt = function (index, color) {
            original.call(mesh, index, color);
            mesh.instanceColor.setUsage(DynamicDrawUsage);
        };
        return mesh;
    }
    #allMatricesNeedUpdate = false;
    #allColorsNeedUpdate = false;
    #updateSingleInstanceOnly = false;
    setInstancePosition(index, x, y, z) {
        const arrIndex = index * 3;
        untrack(() => {
            this.positions[arrIndex] = x;
            this.positions[arrIndex + 1] = y;
            this.positions[arrIndex + 2] = z;
            this.#setMatrix(arrIndex);
            this.three.instanceMatrix.needsUpdate = true;
        });
        queueMicrotaskOnceOnly(this.#triggerPositions);
    }
    #triggerPositions = () => {
        this.#updateSingleInstanceOnly = true;
        this.positions = this.positions;
    };
    setInstanceScale(index, x, y, z) {
        const arrIndex = index * 3;
        untrack(() => {
            this.scales[arrIndex] = x;
            this.scales[arrIndex + 1] = y;
            this.scales[arrIndex + 2] = z;
            this.#setMatrix(arrIndex);
            this.three.instanceMatrix.needsUpdate = true;
        });
        queueMicrotaskOnceOnly(this.#triggerScales);
    }
    #triggerScales = () => {
        this.#updateSingleInstanceOnly = true;
        this.scales = this.scales;
    };
    setInstanceRotation(index, x, y, z) {
        const arrIndex = index * 3;
        untrack(() => {
            this.rotations[arrIndex] = x;
            this.rotations[arrIndex + 1] = y;
            this.rotations[arrIndex + 2] = z;
            this.#setMatrix(arrIndex);
            this.three.instanceMatrix.needsUpdate = true;
        });
        queueMicrotaskOnceOnly(this.#triggerRotations);
    }
    #triggerRotations = () => {
        this.#updateSingleInstanceOnly = true;
        this.rotations = this.rotations;
    };
    setInstanceColor(index, r, g, b) {
        const arrIndex = index * 3;
        untrack(() => {
            this.colors[arrIndex] = r;
            this.colors[arrIndex + 1] = g;
            this.colors[arrIndex + 2] = b;
        });
        this.#setColor(index, r, g, b);
        this.three.instanceColor.needsUpdate = true;
        queueMicrotaskOnceOnly(this.#triggerColors);
    }
    #triggerColors = () => {
        this.#updateSingleInstanceOnly = true;
        this.colors = this.colors;
    };
    #setMatrix(index) {
        _rot.set(this.rotations[index + 0] ?? 0, this.rotations[index + 1] ?? 0, this.rotations[index + 2] ?? 0);
        _quat.setFromEuler(_rot);
        _pos.set(this.positions[index + 0] ?? 0, this.positions[index + 1] ?? 0, this.positions[index + 2] ?? 0);
        _scale.set(this.scales[index + 0] ?? 1, this.scales[index + 1] ?? 1, this.scales[index + 2] ?? 1);
        this._calculateInstanceMatrix(_pos, _quat, _scale, _pivot, _mat);
        this.three.setMatrixAt(index / 3, _mat);
    }
    #setColor(index, r, g, b) {
        _color.setRGB(r, g, b);
        this.three.setColorAt(index, _color);
    }
    updateAllMatrices() {
        for (let i = 0, l = this.count; i < l; i += 1)
            this.#setMatrix(i * 3);
        this.three.instanceMatrix.needsUpdate = true;
    }
    updateAllColors() {
        for (let i = 0, l = this.count; i < l; i += 1) {
            const j = i * 3;
            const r = this.colors[j + 0] ?? 1;
            const g = this.colors[j + 1] ?? 1;
            const b = this.colors[j + 2] ?? 1;
            this.#setColor(i, r, g, b);
        }
        this.three.instanceColor.needsUpdate = true;
    }
    _calculateInstanceMatrix(pos, quat, scale, pivot, result) {
        const position = pos;
        const origin = new Vector3(0.5, 0.5, 0.5);
        const size = this.calculatedSize;
        appliedPosition[0] = position.x;
        appliedPosition[1] = position.y;
        appliedPosition[2] = position.z;
        position.set(appliedPosition[0], -(appliedPosition[1]), appliedPosition[2]);
        if (origin.x !== 0.5 || origin.y !== 0.5 || origin.z !== 0.5) {
            pivot.set(origin.x * size.x - size.x / 2, -(origin.y * size.y - size.y / 2), origin.z * size.z - size.z / 2);
        }
        else {
            pivot.set(0, 0, 0);
        }
        result.compose(position, quat, scale);
        if (pivot.x !== 0 || pivot.y !== 0 || pivot.z !== 0) {
            const px = pivot.x, py = pivot.y, pz = pivot.z;
            const te = result.elements;
            te[12] += px - te[0] * px - te[4] * py - te[8] * pz;
            te[13] += py - te[1] * px - te[5] * py - te[9] * pz;
            te[14] += pz - te[2] * px - te[6] * py - te[10] * pz;
        }
    }
    _loadGL() {
        if (!super._loadGL())
            return false;
        this.createGLEffect(() => {
            if (this.count > this.#biggestCount) {
                this.#biggestCount = this.count;
                this.recreateThree();
                untrack(() => {
                    batch(() => {
                        this.rotations = this.rotations;
                        this.positions = this.positions;
                        this.scales = this.scales;
                        this.colors = this.colors;
                    });
                });
            }
            untrack(() => (this.three.count = this.count));
            this.needsUpdate();
        });
        this.createGLEffect(() => {
            this.rotations;
            if (!this.#updateSingleInstanceOnly)
                this.#allMatricesNeedUpdate = true;
            this.#updateSingleInstanceOnly = false;
            this.needsUpdate();
        });
        this.createGLEffect(() => {
            this.positions;
            if (!this.#updateSingleInstanceOnly)
                this.#allMatricesNeedUpdate = true;
            this.#updateSingleInstanceOnly = false;
            this.needsUpdate();
        });
        this.createGLEffect(() => {
            this.scales;
            if (!this.#updateSingleInstanceOnly)
                this.#allMatricesNeedUpdate = true;
            this.#updateSingleInstanceOnly = false;
            this.needsUpdate();
        });
        this.createGLEffect(() => {
            this.colors;
            if (!this.#updateSingleInstanceOnly)
                this.#allColorsNeedUpdate = true;
            this.#updateSingleInstanceOnly = false;
            this.needsUpdate();
        });
        return true;
    }
    update(t, dt) {
        super.update(t, dt);
        if (this.#allMatricesNeedUpdate) {
            this.#allMatricesNeedUpdate = false;
            this.updateAllMatrices();
        }
        if (this.#allColorsNeedUpdate) {
            this.#allColorsNeedUpdate = false;
            this.updateAllColors();
        }
    }
};
__decorate([
    numberAttribute(10)
], InstancedMesh.prototype, "count", void 0);
__decorate([
    stringAttribute('')
], InstancedMesh.prototype, "rotations", null);
__decorate([
    stringAttribute('')
], InstancedMesh.prototype, "positions", null);
__decorate([
    stringAttribute('')
], InstancedMesh.prototype, "scales", null);
__decorate([
    stringAttribute('')
], InstancedMesh.prototype, "colors", null);
InstancedMesh = __decorate([
    element('lume-instanced-mesh', autoDefineElements)
], InstancedMesh);
export { InstancedMesh };
//# sourceMappingURL=InstancedMesh.js.map
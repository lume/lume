var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
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
// const threeJsPostAdjustment = [0, 0, 0]
// const alignAdjustment = [0, 0, 0]
// const mountPointAdjustment = [0, 0, 0]
const appliedPosition = [0, 0, 0];
/**
 * @element lume-instanced-mesh
 * @class InstancedMesh - This is similar to Mesh, but renders multiple
 * "instances" of a geometry (insead of only one) with a single draw call to
 * the GPU, as if all the instances were a single geometry. This is more
 * efficient in cases where multiple objects to be rendered are similar
 * (share the same geometry and material). Rendering multiple similar objects
 * as separate Mesh instances would otherwise incur one draw call to the GPU
 * per mesh which will be slower.
 *
 * For sake of simplicity, `<lume-instanced-mesh>` has a box-geometry and
 * phong-material by default.
 *
 * ## Example
 *
 * <live-code id="liveExample"></live-code>
 * <script>
 *   liveExample.content = instancedMeshExample
 * </script>
 *
 * @extends Mesh
 *
 */
let InstancedMesh = (() => {
    let _classDecorators = [element('lume-instanced-mesh', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Mesh;
    let _instanceExtraInitializers = [];
    let _count_decorators;
    let _count_initializers = [];
    let _count_extraInitializers = [];
    let _get_rotations_decorators;
    let _get_positions_decorators;
    let _get_scales_decorators;
    let _get_colors_decorators;
    var InstancedMesh = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _count_decorators = [numberAttribute];
            _get_rotations_decorators = [stringAttribute];
            _get_positions_decorators = [stringAttribute];
            _get_scales_decorators = [stringAttribute];
            _get_colors_decorators = [stringAttribute];
            __esDecorate(this, null, _get_rotations_decorators, { kind: "getter", name: "rotations", static: false, private: false, access: { has: obj => "rotations" in obj, get: obj => obj.rotations }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_positions_decorators, { kind: "getter", name: "positions", static: false, private: false, access: { has: obj => "positions" in obj, get: obj => obj.positions }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_scales_decorators, { kind: "getter", name: "scales", static: false, private: false, access: { has: obj => "scales" in obj, get: obj => obj.scales }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _get_colors_decorators, { kind: "getter", name: "colors", static: false, private: false, access: { has: obj => "colors" in obj, get: obj => obj.colors }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _count_decorators, { kind: "field", name: "count", static: false, private: false, access: { has: obj => "count" in obj, get: obj => obj.count, set: (obj, value) => { obj.count = value; } }, metadata: _metadata }, _count_initializers, _count_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            InstancedMesh = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /**
         * @property {number} count - The number of instances to render.
         */
        count = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _count_initializers, 10));
        #biggestCount = (__runInitializers(this, _count_extraInitializers), this.count);
        /**
         * @property {number[]} rotations - The rotations for each instance.
         * Generally the array should have a length of `this.count * 3` because
         * each rotation consists of three numbers for X, Y, and Z axes. Every three
         * numbers is one X,Y,Z triplet. If the array has less rotations than
         * `this.count`, the missing rotations will be considered to have
         * values of zero. If it has more than `this.count` rotations, those
         * rotations are ignored.
         */
        get rotations() {
            return this.#rotations;
        }
        set rotations(v) {
            this.#rotations = stringToNumberArray(v, 'rotations');
        }
        #rotations = [];
        /**
         * @property {number[]} positions - The positions for each instance.
         * Generally the array should have a length of `this.count * 3` because
         * each rotation consists of three numbers for X, Y, and Z axes. Every three
         * numbers is one X,Y,Z triplet. If the array has less positions than
         * `this.count`, the missing positions will be considered to have
         * values of zero. If it has more than `this.count` positions, those
         * positions are ignored.
         */
        get positions() {
            return this.#positions;
        }
        set positions(v) {
            this.#positions = stringToNumberArray(v, 'positions');
        }
        #positions = [];
        /**
         * @property {number[]} scales - The scales for each instance.
         * Generally the array should have a length of `this.count * 3` because
         * each rotation consists of three numbers for X, Y, and Z axes. Every three
         * numbers is one X,Y,Z triplet. If the array has less scales than
         * `this.count`, the missing scales will be considered to have
         * values of zero. If it has more than `this.count` scales, those
         * scales are ignored.
         */
        get scales() {
            return this.#scales;
        }
        set scales(v) {
            this.#scales = stringToNumberArray(v, 'scales');
        }
        #scales = [];
        /**
         * @property {number[]} colors - The colors for each instance.
         * Generally the array should have a length of `this.count * 3` because
         * each rotation consists of three numbers for R, G, and B color components. Every three
         * numbers is one R,G,B triplet. If the array has less colors than
         * `this.count`, the missing colors will be considered to have
         * values of zero (black). If it has more than `this.count` colors, those
         * colors are ignored.
         */
        get colors() {
            return this.#colors;
        }
        set colors(v) {
            this.#colors = stringToNumberArray(v, 'colors');
        }
        #colors = [];
        initialBehaviors = { geometry: 'box', material: 'physical' };
        // This class will have a THREE.InstancedMesh for its .three property.
        makeThreeObject3d() {
            let geometryBehavior = null;
            let materialBehavior = null;
            for (const [name, behavior] of this.behaviors) {
                if (name.endsWith('-geometry'))
                    geometryBehavior = behavior;
                else if (name.endsWith('-material'))
                    materialBehavior = behavior;
            }
            // Use the existing geometry and material from the behaviors in case we are in the recreateThree process.
            const mesh = new ThreeInstancedMesh(geometryBehavior?.meshComponent || new BoxGeometry(), materialBehavior?.meshComponent || new MeshPhongMaterial(), this.#biggestCount);
            // TODO make this configurable. Most people probably won't care about this.
            mesh.instanceMatrix.setUsage(DynamicDrawUsage);
            const original = mesh.setColorAt;
            mesh.setColorAt = function (index, color) {
                // This creates the instanceColor buffer if it doesn't exist.
                original.call(mesh, index, color);
                // TODO make this configurable. Most people probably won't care about this.
                mesh.instanceColor.setUsage(DynamicDrawUsage);
            };
            return mesh;
        }
        #allMatricesNeedUpdate = false;
        #allColorsNeedUpdate = false;
        #updateSingleInstanceOnly = false;
        setInstancePosition(index, x, y, z) {
            const arrIndex = index * 3;
            // Untrack because the purpose of the method is to update this, not read it.
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
            this.positions = this.positions; // trigger reactivity
        };
        setInstanceScale(index, x, y, z) {
            const arrIndex = index * 3;
            // Untrack because the purpose of the method is to update this, not read it.
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
            this.scales = this.scales; // trigger reactivity
        };
        setInstanceRotation(index, x, y, z) {
            const arrIndex = index * 3;
            // Untrack because the purpose of the method is to update this, not read it.
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
            this.rotations = this.rotations; // trigger reactivity
        };
        setInstanceColor(index, r, g, b) {
            const arrIndex = index * 3;
            // Untrack because the purpose of the method is to update this, not read it.
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
            this.colors = this.colors; // trigger reactivity
        };
        // TODO Might just be able to set individual components of the matrix
        // without recalculating other components (f.e. if only an instance position
        // changed but not rotation)
        #setMatrix(index) {
            _rot.set(this.rotations[index + 0] ?? 0, this.rotations[index + 1] ?? 0, this.rotations[index + 2] ?? 0);
            _quat.setFromEuler(_rot);
            _pos.set(this.positions[index + 0] ?? 0, this.positions[index + 1] ?? 0, this.positions[index + 2] ?? 0);
            _scale.set(this.scales[index + 0] ?? 1, this.scales[index + 1] ?? 1, this.scales[index + 2] ?? 1);
            // Modifies _mat in place.
            this._calculateInstanceMatrix(_pos, _quat, _scale, _pivot, _mat);
            this.three.setMatrixAt(index / 3, _mat);
        }
        // TODO a colorMode variable can specify whether colors are RGB triplets, or CSS string/hex values.
        // TODO Set an update range so that if we're updating only one instance, we're not uploading the whole array each time.
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
        /**
         * This is very similar to SharedAPI._calculateMatrix, without the threeCSS parts.
         */
        _calculateInstanceMatrix(pos, quat, scale, pivot, result) {
            // const align = new Vector3(0, 0, 0) // TODO
            // const mountPoint = new Vector3(0, 0, 0) // TODO
            const position = pos;
            const origin = new Vector3(0.5, 0.5, 0.5); // TODO
            const size = this.calculatedSize;
            // In the following commented code, we ignore the
            // threeJsPostAdjustment, alignAdjustment, and mountPointAdjustment
            // because the align point and mount point of the instances are
            // inherited from the IntancedMesh element's positioning.  In other
            // words, the instances are positioned relative to the element's
            // position, which already has alignPoint and mountPoint factored into
            // it.
            // TODO Should we provide the same alignment and mount point API for
            // instances, and would align point be relative to the InstancedMesh
            // element (as if instances are sub nodes of the InstancedMesh
            // element), or to the InstancedMesh element's parent (as if instances
            // are sub nodes of the parent, just like a single mesh would be)?
            // THREE-COORDS-TO-DOM-COORDS
            // translate the "mount point" back to the top/left/back of the object
            // (in Three.js it is in the center of the object).
            // threeJsPostAdjustment[0] = size.x / 2
            // threeJsPostAdjustment[1] = size.y / 2
            // threeJsPostAdjustment[2] = size.z / 2
            // const parentSize = this._getParentSize()
            // THREE-COORDS-TO-DOM-COORDS
            // translate the "align" back to the top/left/back of the parent element.
            // We offset this in ElementOperations#applyTransform. The Y
            // value is inverted because we invert it below.
            // threeJsPostAdjustment[0] += -parentSize.x / 2
            // threeJsPostAdjustment[1] += -parentSize.y / 2
            // threeJsPostAdjustment[2] += -parentSize.z / 2
            // alignAdjustment[0] = parentSize.x * align.x
            // alignAdjustment[1] = parentSize.y * align.y
            // alignAdjustment[2] = parentSize.z * align.z
            // mountPointAdjustment[0] = size.x * mountPoint.x
            // mountPointAdjustment[1] = size.y * mountPoint.y
            // mountPointAdjustment[2] = size.z * mountPoint.z
            appliedPosition[0] = position.x; /*+ alignAdjustment[0] - mountPointAdjustment[0]*/
            appliedPosition[1] = position.y; /*+ alignAdjustment[1] - mountPointAdjustment[1]*/
            appliedPosition[2] = position.z; /*+ alignAdjustment[2] - mountPointAdjustment[2]*/
            // NOTE We negate Y translation in several places below so that Y
            // goes downward like in DOM's CSS transforms.
            position.set(appliedPosition[0] /*+ threeJsPostAdjustment[0]*/, 
            // THREE-COORDS-TO-DOM-COORDS negate the Y value so that
            // Three.js' positive Y is downward like DOM.
            -(appliedPosition[1] /*+ threeJsPostAdjustment[1]*/), appliedPosition[2] /*+ threeJsPostAdjustment[2]*/);
            if (origin.x !== 0.5 || origin.y !== 0.5 || origin.z !== 0.5) {
                // Here we multiply by size to convert from a ratio to a range
                // of units, then subtract half because Three.js origin is
                // centered around (0,0,0) meaning Three.js origin goes from
                // -0.5 to 0.5 instead of from 0 to 1.
                pivot.set(origin.x * size.x - size.x / 2, 
                // THREE-COORDS-TO-DOM-COORDS negate the Y value so that
                // positive Y means down instead of up (because Three,js Y
                // values go up).
                -(origin.y * size.y - size.y / 2), origin.z * size.z - size.z / 2);
            }
            // otherwise, use default Three.js origin of (0,0,0) which is
            // equivalent to our (0.5,0.5,0.5), by removing the pivot value.
            else {
                pivot.set(0, 0, 0);
            }
            // effectively the same as Object3DWithPivot.updateMatrix() {
            result.compose(position, quat, scale);
            if (pivot.x !== 0 || pivot.y !== 0 || pivot.z !== 0) {
                const px = pivot.x, py = pivot.y, pz = pivot.z;
                const te = result.elements;
                te[12] += px - te[0] * px - te[4] * py - te[8] * pz;
                te[13] += py - te[1] * px - te[5] * py - te[9] * pz;
                te[14] += pz - te[2] * px - te[6] * py - te[10] * pz;
            }
            // }
        }
        connectedCallback() {
            super.connectedCallback();
            this.createEffect(() => {
                // Increase the InstancedMesh size (by making a new one) as needed.
                if (this.count > this.#biggestCount) {
                    this.#biggestCount = this.count;
                    this.recreateThree();
                    // Be sure to trigger all the instance components so that the new
                    // InstancedMesh will be up-to-date.
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
            this.createEffect(() => {
                this.rotations;
                if (!this.#updateSingleInstanceOnly)
                    this.#allMatricesNeedUpdate = true;
                this.#updateSingleInstanceOnly = false;
                this.needsUpdate();
            });
            this.createEffect(() => {
                this.positions;
                if (!this.#updateSingleInstanceOnly)
                    this.#allMatricesNeedUpdate = true;
                this.#updateSingleInstanceOnly = false;
                this.needsUpdate();
            });
            this.createEffect(() => {
                this.scales;
                if (!this.#updateSingleInstanceOnly)
                    this.#allMatricesNeedUpdate = true;
                this.#updateSingleInstanceOnly = false;
                this.needsUpdate();
            });
            this.createEffect(() => {
                this.colors;
                if (!this.#updateSingleInstanceOnly)
                    this.#allColorsNeedUpdate = true;
                this.#updateSingleInstanceOnly = false;
                this.needsUpdate();
            });
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
    return InstancedMesh = _classThis;
})();
export { InstancedMesh };
//# sourceMappingURL=InstancedMesh.js.map
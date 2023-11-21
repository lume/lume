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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { createEffect, createRoot, on, untrack } from 'solid-js';
import { signal } from 'classy-solid';
import { attribute, element } from '@lume/element';
import { TreeNode } from './TreeNode.js';
import { XYZSizeModeValues } from '../xyz-values/XYZSizeModeValues.js';
import { XYZNonNegativeValues } from '../xyz-values/XYZNonNegativeValues.js';
import { Motor } from './Motor.js';
import { CompositionTracker } from './CompositionTracker.js';
const previousSize = {};
const sizeMode = new WeakMap();
const size = new WeakMap();
/**
 * @class Sizeable - Provides features for defining the size volume of an object in 3D space.
 *
 * The properties of `Sizeable` all follow a common usage pattern,
 * described in the [`Common Attributes`](../../guide/common-attributes) doc.
 *
 * @extends TreeNode
 */
// Sizeable and its subclass Transformable extend from TreeNode because they know
// about their `parent` when calculating proportional sizes or world matrices
// based on parent values.
let Sizeable = (() => {
    let _classDecorators = [element];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = CompositionTracker(TreeNode);
    let _instanceExtraInitializers = [];
    let ___calculatedSize_decorators;
    let ___calculatedSize_initializers = [];
    let _set_sizeMode_decorators;
    let _set_size_decorators;
    var Sizeable = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            ___calculatedSize_decorators = [signal];
            _set_sizeMode_decorators = [attribute];
            _set_size_decorators = [attribute];
            __esDecorate(this, null, _set_sizeMode_decorators, { kind: "setter", name: "sizeMode", static: false, private: false, access: { has: obj => "sizeMode" in obj, set: (obj, value) => { obj.sizeMode = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _set_size_decorators, { kind: "setter", name: "size", static: false, private: false, access: { has: obj => "size" in obj, set: (obj, value) => { obj.size = value; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, ___calculatedSize_decorators, { kind: "field", name: "__calculatedSize", static: false, private: false, access: { has: obj => "__calculatedSize" in obj, get: obj => obj.__calculatedSize, set: (obj, value) => { obj.__calculatedSize = value; } }, metadata: _metadata }, ___calculatedSize_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            Sizeable = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        constructor() {
            super();
            // TODO remove this, it causes confusion with infinite loops when doing
            // this.position.x = 123 in an effect, requiring untrack.
            createRoot(() => {
                // NOTE REACTIVITY When sub-properties of the XYZValues objects change,
                // trigger reactivity for the respective properties. See also NOTE REACTIVITY
                // below.
                createEffect(on(this.sizeMode.asDependency, () => (this.sizeMode = this.sizeMode)));
                createEffect(on(this.size.asDependency, () => (this.size = this.size)));
            });
        }
        __calculatedSize = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, ___calculatedSize_initializers, { x: 0, y: 0, z: 0 }
        /**
         * @property {string | [x?: string, y?: string, z?: string] | {x?: string, y?: string, z?: string} | XYZSizeModeValues | null} sizeMode -
         *
         * *attribute*
         *
         * Default: <code>new [XYZSizeModeValues](../xyz-values/XYZSizeModeValues)('literal', 'literal', 'literal')</code>
         *
         * Set the size mode for each axis. Possible values are `"literal"` (or `"l"` for short) and
         * `"proportional"` (or `"p"` for short). For example,
         *
         * ```html
         * <lume-element3d size-mode="proportional literal"></lume-element3d>
         * <lume-element3d size-mode="p l"></lume-element3d>
         * ```
         *
         * The value of `.sizeMode` for a particular axis dictates how the respective
         * [`.size`](#size) value along the same axis will behave:
         *
         * - A value of `"literal"` for an axis means the `.size` value along that
         * axis will be literally as specified.
         * - A value of `"proportional"` for an axis means the `.size`
         * value along that axis will be a proportion of the object's parent's size
         * along that axis.
         */
        ));
        /**
         * @property {string | [x?: string, y?: string, z?: string] | {x?: string, y?: string, z?: string} | XYZSizeModeValues | null} sizeMode -
         *
         * *attribute*
         *
         * Default: <code>new [XYZSizeModeValues](../xyz-values/XYZSizeModeValues)('literal', 'literal', 'literal')</code>
         *
         * Set the size mode for each axis. Possible values are `"literal"` (or `"l"` for short) and
         * `"proportional"` (or `"p"` for short). For example,
         *
         * ```html
         * <lume-element3d size-mode="proportional literal"></lume-element3d>
         * <lume-element3d size-mode="p l"></lume-element3d>
         * ```
         *
         * The value of `.sizeMode` for a particular axis dictates how the respective
         * [`.size`](#size) value along the same axis will behave:
         *
         * - A value of `"literal"` for an axis means the `.size` value along that
         * axis will be literally as specified.
         * - A value of `"proportional"` for an axis means the `.size`
         * value along that axis will be a proportion of the object's parent's size
         * along that axis.
         */
        set sizeMode(newValue) {
            if (typeof newValue === 'function')
                throw new TypeError('property functions are not allowed for sizeMode');
            if (!sizeMode.has(this))
                sizeMode.set(this, new XYZSizeModeValues('literal', 'literal', 'literal'));
            this._setPropertyXYZ('sizeMode', sizeMode.get(this), newValue);
        }
        get sizeMode() {
            if (!sizeMode.has(this))
                sizeMode.set(this, new XYZSizeModeValues('literal', 'literal', 'literal'));
            return sizeMode.get(this);
        }
        // TODO: A "differential" size would be cool. Good for padding,
        // borders, etc. Inspired from Famous' differential sizing.
        //
        // TODO: A "target" size where sizing can be relative to another node.
        // This would be tricky though, because there could be circular size
        // dependencies. Maybe we'd throw an error in that case, because there'd be no original size to base off of.
        /**
         * @property {string | [x?: number, y?: number, z?: number] | {x?: number, y?: number, z?: number} | XYZNonNegativeValues | null} size -
         *
         * *attribute*
         *
         * Default: <code>new [XYZNonNegativeValues](../xyz-values/XYZNonNegativeValues)(0, 0, 0)</code>
         *
         * Set the size of the object along each axis. The meaning of a size value for a particular axis depends on the
         * [`.sizeMode`](#sizemode) value for the same axis.
         *
         * All size values must be positive numbers or an error is thrown.
         *
         * Literal sizes can be any positive value (the literal size that you want).
         * Proportional size along an axis represents a proportion of the parent
         * size on the same axis. `0` means 0% of the parent size, and `1.0` means
         * 100% of the parent size.
         *
         * For example, if `.sizeMode` is set to `el.sizeMode = ['literal',
         * 'proportional', 'literal']`, then setting `el.size = [20, 0.5, 30]` means
         * the X size is a literal value of `20`, the Y size is 50% of the parent Y
         * size, and the Z size is a literal value of `30`. It is easy this way to
         * mix literal and proportional sizes for the different axes.
         */
        set size(newValue) {
            if (!size.has(this))
                size.set(this, new XYZNonNegativeValues(0, 0, 0));
            this._setPropertyXYZ('size', size.get(this), newValue);
        }
        get size() {
            if (!size.has(this))
                size.set(this, new XYZNonNegativeValues(0, 0, 0));
            return size.get(this);
        }
        /**
         * @property {{x: number, y: number, z: number}} calculatedSize -
         *
         * *readonly*, *signal*
         *
         * Get the actual size of an element as an object with `x`, `y`, and `z`
         * properties, each property containing the computed size along its
         * respective axis.
         *
         * This can be useful when size is proportional, as the actual size of the
         * an element will depend on the size of its parent, and otherwise looking
         * at the `.size` value won't tell us the actual size.
         */
        get calculatedSize() {
            // TODO we can re-calculate the actual size lazily, this way it can
            // normally be deferred to a Motor render task, unless a user
            // explicitly needs it and reads the value.
            // if (this.__sizeDirty) this._calcSize
            // TODO make it a readonly reactive object instead of cloning.
            return { ...(this.__calculatedSize ?? { x: 0, y: 0, z: 0 }) };
        }
        get composedLumeParent() {
            const result = this.composedParent;
            if (!(result instanceof Sizeable))
                return null;
            return result;
        }
        get composedLumeChildren() {
            return super._composedChildren;
        }
        /**
         * @property {{x: number, y: number, z: number}} parentSize
         *
         * *signal* *readonly*
         *
         * Returns an object with `x`, `y`, and `z` properties containing the size
         * dimensions of the composed LUME parent. If there is no composed LUME
         * parent, the size is 0,0,0.
         */
        get parentSize() {
            return this.composedLumeParent?.calculatedSize ?? { x: 0, y: 0, z: 0 };
        }
        _calcSize() {
            const calculatedSize = this.__calculatedSize ?? { x: 0, y: 0, z: 0 };
            Object.assign(previousSize, calculatedSize);
            const size = this.size;
            const sizeMode = this.sizeMode;
            const { x: modeX, y: modeY, z: modeZ } = sizeMode;
            const parentSize = this.parentSize;
            if (modeX === 'literal' || modeX === 'l') {
                calculatedSize.x = size.x;
            }
            else if (modeX === 'proportional' || modeX === 'p') {
                calculatedSize.x = parentSize.x * size.x;
            }
            if (modeY === 'literal' || modeY === 'l') {
                calculatedSize.y = size.y;
            }
            else if (modeY === 'proportional' || modeY === 'p') {
                calculatedSize.y = parentSize.y * size.y;
            }
            if (modeZ === 'literal' || modeZ === 'l') {
                calculatedSize.z = size.z;
            }
            else if (modeZ === 'proportional' || modeZ === 'p') {
                calculatedSize.z = parentSize.z * size.z;
            }
            // We set it to the same value to trigger reactivity.
            this.__calculatedSize = calculatedSize;
            if (previousSize.x !== calculatedSize.x ||
                previousSize.y !== calculatedSize.y ||
                previousSize.z !== calculatedSize.z) {
                // TODO replace events with reactivity
                this.emit('sizechange', { ...calculatedSize });
            }
        }
        #isSettingProperty = false;
        get _isSettingProperty() {
            return this.#isSettingProperty;
        }
        _setPropertyXYZ(name, xyz, newValue) {
            // @ts-ignore
            if (newValue === xyz)
                return;
            this.#isSettingProperty = true;
            if (name === 'rotation') {
                console.log('new rotation value:', newValue, this.#settingValueFromPropFunction);
                // debugger
            }
            if (isXYZPropertyFunction(newValue)) {
                this.#handleXYZPropertyFunction(newValue, name, xyz);
            }
            else {
                if (!this.#settingValueFromPropFunction)
                    this.#removePropertyFunction(name);
                else
                    this.#settingValueFromPropFunction = false;
                // NOTE REACTIVITY We're already in the middle of setting a property, so untrack to
                // prevent an infinite reactivity loop the reactivity triggers we
                // set up in the constructor.
                untrack(() => xyz.from(newValue));
            }
            this.#isSettingProperty = false;
        }
        _setPropertySingle(name, setter, newValue) {
            this.#isSettingProperty = true;
            if (isSinglePropertyFunction(newValue)) {
                this.#handleSinglePropertyFunction(newValue, name);
            }
            else {
                if (!this.#settingValueFromPropFunction)
                    this.#removePropertyFunction(name);
                else
                    this.#settingValueFromPropFunction = false;
                // Same note about this untrack() call as the one in _setPropertyXYZ.
                untrack(() => setter(newValue)); // FIXME no any
            }
            this.#isSettingProperty = false;
        }
        #propertyFunctions = null;
        #settingValueFromPropFunction = false;
        #handleXYZPropertyFunction(fn, name, xyz) {
            if (!this.#propertyFunctions)
                this.#propertyFunctions = new Map();
            const propFunction = this.#propertyFunctions.get(name);
            if (propFunction)
                Motor.removeRenderTask(propFunction);
            this.#propertyFunctions.set(name, Motor.addRenderTask((time, deltaTime) => {
                const result = fn(xyz.x, xyz.y, xyz.z, time, deltaTime);
                if (result === false) {
                    this.#propertyFunctions.delete(name);
                    return false;
                }
                this.#settingValueFromPropFunction = true;
                xyz.from(result);
                return;
            }));
        }
        #handleSinglePropertyFunction(fn, name) {
            if (!this.#propertyFunctions)
                this.#propertyFunctions = new Map();
            const propFunction = this.#propertyFunctions.get(name);
            if (propFunction)
                Motor.removeRenderTask(propFunction);
            this.#propertyFunctions.set(name, Motor.addRenderTask(time => {
                const result = fn(this[name], time);
                if (result === false) {
                    this.#propertyFunctions.delete(name);
                    return false;
                }
                this.#settingValueFromPropFunction = true;
                this[name] = result;
                // TODO The RenderTask return type is `false | void`, so why
                // does the noImplicitReturns TS option require a return
                // here? Open bug on TypeScript.
                return;
            }));
        }
        // remove property function (render task) if any.
        #removePropertyFunction(name) {
            if (!this.#propertyFunctions)
                return;
            const propFunction = this.#propertyFunctions.get(name);
            if (propFunction) {
                Motor.removeRenderTask(propFunction);
                this.#propertyFunctions.delete(name);
                if (!this.#propertyFunctions.size)
                    this.#propertyFunctions = null;
            }
        }
    };
    return Sizeable = _classThis;
})();
export { Sizeable };
// the following type guards are used above just to satisfy the type system,
// though the actual runtime check does not guarantee that the functions are of
// the expected shape.
function isXYZPropertyFunction(f) {
    return typeof f === 'function';
}
function isSinglePropertyFunction(f) {
    return typeof f === 'function';
}
//# sourceMappingURL=Sizeable.js.map
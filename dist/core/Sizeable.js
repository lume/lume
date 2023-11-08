var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Sizeable_1;
import { createEffect, createRoot, on, untrack } from 'solid-js';
import { attribute, element, reactive } from '@lume/element';
import { TreeNode } from './TreeNode.js';
import { XYZSizeModeValues } from '../xyz-values/XYZSizeModeValues.js';
import { XYZNonNegativeValues } from '../xyz-values/XYZNonNegativeValues.js';
import { Motor } from './Motor.js';
import { CompositionTracker } from './CompositionTracker.js';
const previousSize = {};
const sizeMode = new WeakMap();
const size = new WeakMap();
let Sizeable = Sizeable_1 = class Sizeable extends CompositionTracker(TreeNode) {
    constructor() {
        super();
        createRoot(() => {
            createEffect(on(this.sizeMode.asDependency, () => (this.sizeMode = this.sizeMode)));
            createEffect(on(this.size.asDependency, () => (this.size = this.size)));
        });
    }
    __calculatedSize = { x: 0, y: 0, z: 0 };
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
    get calculatedSize() {
        return { ...(this.__calculatedSize ?? { x: 0, y: 0, z: 0 }) };
    }
    get composedLumeParent() {
        const result = this.composedParent;
        if (!(result instanceof Sizeable_1))
            return null;
        return result;
    }
    get composedLumeChildren() {
        return super._composedChildren;
    }
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
        this.__calculatedSize = calculatedSize;
        if (previousSize.x !== calculatedSize.x ||
            previousSize.y !== calculatedSize.y ||
            previousSize.z !== calculatedSize.z) {
            this.emit('sizechange', { ...calculatedSize });
        }
    }
    #isSettingProperty = false;
    get _isSettingProperty() {
        return this.#isSettingProperty;
    }
    _setPropertyXYZ(name, xyz, newValue) {
        if (newValue === xyz)
            return;
        this.#isSettingProperty = true;
        if (isXYZPropertyFunction(newValue)) {
            this.#handleXYZPropertyFunction(newValue, name, xyz);
        }
        else {
            if (!this.#settingValueFromPropFunction)
                this.#removePropertyFunction(name);
            else
                this.#settingValueFromPropFunction = false;
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
            untrack(() => setter(newValue));
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
            return;
        }));
    }
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
__decorate([
    reactive
], Sizeable.prototype, "__calculatedSize", void 0);
__decorate([
    attribute
], Sizeable.prototype, "sizeMode", null);
__decorate([
    attribute
], Sizeable.prototype, "size", null);
Sizeable = Sizeable_1 = __decorate([
    element
], Sizeable);
export { Sizeable };
function isXYZPropertyFunction(f) {
    return typeof f === 'function';
}
function isSinglePropertyFunction(f) {
    return typeof f === 'function';
}
//# sourceMappingURL=Sizeable.js.map
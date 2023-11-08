var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { reactive } from '@lume/element';
import { getInheritedDescriptor } from 'lowclass';
import { stringToArray } from './utils.js';
const defaultValues = { x: undefined, y: undefined, z: undefined };
let XYZValues = class XYZValues extends Object {
    #x = undefined;
    #y = undefined;
    #z = undefined;
    set x(value) {
        if (typeof value === 'string')
            value = this.deserializeValue('x', value);
        if (!this.checkValue('x', value))
            return;
        this.#x = value;
    }
    get x() {
        return this.#x;
    }
    set y(value) {
        if (typeof value === 'string')
            value = this.deserializeValue('y', value);
        if (!this.checkValue('y', value))
            return;
        this.#y = value;
    }
    get y() {
        return this.#y;
    }
    set z(value) {
        if (typeof value === 'string')
            value = this.deserializeValue('z', value);
        if (!this.checkValue('z', value))
            return;
        this.#z = value;
    }
    get z() {
        return this.#z;
    }
    constructor(x, y, z) {
        super();
        this.#from(x, y, z);
    }
    get #default() {
        return this.default || defaultValues;
    }
    fromDefault() {
        this.from(this.#default);
        return this;
    }
    #from(x, y, z) {
        if (x == null && y === undefined && z === undefined) {
            this.fromDefault();
        }
        else if (Array.isArray(x)) {
            this.fromArray(x);
        }
        else if (typeof x === 'object' && x !== null) {
            if (x === this)
                return this;
            this.fromObject(x);
        }
        else if (typeof x === 'string' && y === undefined && z === undefined) {
            this.fromString(x);
        }
        else
            this.set(x, y, z);
        return this;
    }
    from(x, y, z) {
        return this.#from(x, y, z);
    }
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    fromArray(array) {
        this.set(array[0], array[1], array[2]);
        return this;
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
    fromObject(object) {
        this.set(object.x, object.y, object.z);
        return this;
    }
    toObject() {
        return { x: this.x, y: this.y, z: this.z };
    }
    fromString(string, separator = ',') {
        this.fromArray(this.#stringToArray(string, separator));
        return this;
    }
    toString(separator = '') {
        if (separator) {
            return `${this.x}${separator} ${this.y}${separator} ${this.z}`;
        }
        else {
            return `${this.x} ${this.y} ${this.z}`;
        }
    }
    deserializeValue(_prop, value) {
        return value;
    }
    #stringToArray(string, separator = ',') {
        const values = stringToArray(string, separator);
        const result = [];
        const length = values.length;
        if (length > 0)
            result[0] = this.deserializeValue('x', values[0]);
        if (length > 1)
            result[1] = this.deserializeValue('y', values[1]);
        if (length > 2)
            result[2] = this.deserializeValue('z', values[2]);
        return result;
    }
    checkValue(_prop, _value) {
        return true;
    }
    asDependency = () => {
        this.x;
        this.y;
        this.z;
    };
};
__decorate([
    reactive
], XYZValues.prototype, "x", null);
__decorate([
    reactive
], XYZValues.prototype, "y", null);
__decorate([
    reactive
], XYZValues.prototype, "z", null);
XYZValues = __decorate([
    reactive
], XYZValues);
export { XYZValues };
function enumerable(obj, prop) {
    Object.defineProperty(obj, prop, { ...getInheritedDescriptor(obj, prop), enumerable: true });
}
enumerable(XYZValues.prototype, 'x');
enumerable(XYZValues.prototype, 'y');
enumerable(XYZValues.prototype, 'z');
//# sourceMappingURL=XYZValues.js.map
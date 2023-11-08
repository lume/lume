var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { createEffect, createRoot, on } from 'solid-js';
import { attribute, element } from '@lume/element';
import { XYZNumberValues } from '../xyz-values/XYZNumberValues.js';
import { Sizeable } from './Sizeable.js';
const position = new WeakMap();
const rotation = new WeakMap();
const scale = new WeakMap();
const origin = new WeakMap();
const alignPoint = new WeakMap();
const mountPoint = new WeakMap();
let Transformable = class Transformable extends Sizeable {
    constructor() {
        super();
        createRoot(() => {
            createEffect(on(this.position.asDependency, () => (this.position = this.position)));
            createEffect(on(this.rotation.asDependency, () => (this.rotation = this.rotation)));
            createEffect(on(this.scale.asDependency, () => (this.scale = this.scale)));
            createEffect(on(this.origin.asDependency, () => (this.origin = this.origin)));
            createEffect(on(this.alignPoint.asDependency, () => (this.alignPoint = this.alignPoint)));
            createEffect(on(this.mountPoint.asDependency, () => (this.mountPoint = this.mountPoint)));
        });
    }
    set position(newValue) {
        if (!position.has(this))
            position.set(this, new XYZNumberValues(0, 0, 0));
        this._setPropertyXYZ('position', position.get(this), newValue);
    }
    get position() {
        if (!position.has(this))
            position.set(this, new XYZNumberValues(0, 0, 0));
        return position.get(this);
    }
    set rotation(newValue) {
        if (!rotation.has(this))
            rotation.set(this, new XYZNumberValues(0, 0, 0));
        this._setPropertyXYZ('rotation', rotation.get(this), newValue);
    }
    get rotation() {
        if (!rotation.has(this))
            rotation.set(this, new XYZNumberValues(0, 0, 0));
        return rotation.get(this);
    }
    set scale(newValue) {
        if (!scale.has(this))
            scale.set(this, new XYZNumberValues(1, 1, 1));
        this._setPropertyXYZ('scale', scale.get(this), newValue);
    }
    get scale() {
        if (!scale.has(this))
            scale.set(this, new XYZNumberValues(1, 1, 1));
        return scale.get(this);
    }
    set origin(newValue) {
        if (!origin.has(this))
            origin.set(this, new XYZNumberValues(0.5, 0.5, 0.5));
        this._setPropertyXYZ('origin', origin.get(this), newValue);
    }
    get origin() {
        if (!origin.has(this))
            origin.set(this, new XYZNumberValues(0.5, 0.5, 0.5));
        return origin.get(this);
    }
    set alignPoint(newValue) {
        if (!alignPoint.has(this))
            alignPoint.set(this, new XYZNumberValues(0, 0, 0));
        this._setPropertyXYZ('alignPoint', alignPoint.get(this), newValue);
    }
    get alignPoint() {
        if (!alignPoint.has(this))
            alignPoint.set(this, new XYZNumberValues(0, 0, 0));
        return alignPoint.get(this);
    }
    set mountPoint(newValue) {
        if (!mountPoint.has(this))
            mountPoint.set(this, new XYZNumberValues(0, 0, 0));
        this._setPropertyXYZ('mountPoint', mountPoint.get(this), newValue);
    }
    get mountPoint() {
        if (!mountPoint.has(this))
            mountPoint.set(this, new XYZNumberValues(0, 0, 0));
        return mountPoint.get(this);
    }
};
__decorate([
    attribute
], Transformable.prototype, "position", null);
__decorate([
    attribute
], Transformable.prototype, "rotation", null);
__decorate([
    attribute
], Transformable.prototype, "scale", null);
__decorate([
    attribute
], Transformable.prototype, "origin", null);
__decorate([
    attribute
], Transformable.prototype, "alignPoint", null);
__decorate([
    attribute
], Transformable.prototype, "mountPoint", null);
Transformable = __decorate([
    element
], Transformable);
export { Transformable };
//# sourceMappingURL=Transformable.js.map
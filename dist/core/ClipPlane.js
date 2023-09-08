var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { element } from '@lume/element';
import { Plane } from 'three/src/math/Plane.js';
import { Vector3 } from 'three/src/math/Vector3.js';
import { createSignal } from 'solid-js';
import { Element3D } from './Element3D.js';
import { autoDefineElements } from '../LumeConfig.js';
const clipNormal = [0, 0, -1];
let ClipPlane = class ClipPlane extends Element3D {
    #plane = createSignal(null);
    #inversePlane = createSignal(null);
    get __clip() {
        return this.#plane[0]();
    }
    get __inverseClip() {
        return this.#inversePlane[0]();
    }
    _loadGL() {
        if (!super._loadGL())
            return false;
        this.#plane[1](new Plane(new Vector3(...clipNormal)));
        this.#inversePlane[1](new Plane(new Vector3(...clipNormal).negate()));
        return true;
    }
    _unloadGL() {
        if (!super._unloadGL())
            return false;
        this.#plane[1](null);
        this.#inversePlane[1](null);
        return true;
    }
    updateWorldMatrices() {
        super.updateWorldMatrices();
        const plane = this.#plane[0]();
        const inverse = this.#inversePlane[0]();
        if (!plane || !inverse)
            return;
        plane.normal.set(...clipNormal);
        plane.constant = 0;
        inverse.normal.set(...clipNormal).negate();
        inverse.constant = 0;
        plane.applyMatrix4(this.three.matrixWorld);
        inverse.applyMatrix4(this.three.matrixWorld);
    }
};
ClipPlane = __decorate([
    element('lume-clip-plane', autoDefineElements)
], ClipPlane);
export { ClipPlane };
//# sourceMappingURL=ClipPlane.js.map
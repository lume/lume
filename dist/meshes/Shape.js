var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { element } from '@lume/element';
import { Mesh } from './Mesh.js';
import { autoDefineElements } from '../LumeConfig.js';
let Shape = class Shape extends Mesh {
    static defaultBehaviors = {
        'shape-geometry': (initialBehaviors) => {
            return !initialBehaviors.some((b) => b.endsWith('-geometry'));
        },
        'phong-material': (initialBehaviors) => {
            return !initialBehaviors.some((b) => b.endsWith('-material'));
        },
    };
};
Shape = __decorate([
    element('lume-shape', autoDefineElements)
], Shape);
export { Shape };
//# sourceMappingURL=Shape.js.map
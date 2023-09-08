var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { booleanAttribute, element } from '@lume/element';
import { SharedAPI } from './SharedAPI.js';
import { autoDefineElements } from '../LumeConfig.js';
let Element3D = class Element3D extends SharedAPI {
    hasShadow = false;
    isElement3D = true;
    visible = true;
    get parentSize() {
        const composedLumeParent = this.composedLumeParent;
        if (this.scene && this.scene === this.parentElement)
            return this.scene.calculatedSize;
        return composedLumeParent?.calculatedSize ?? { x: 0, y: 0, z: 0 };
    }
    constructor() {
        super();
        if (this.composedLumeParent) {
            this._calcSize();
            queueMicrotask(() => this.needsUpdate());
        }
    }
    traverseSceneGraph(visitor, waitForUpgrade = false) {
        visitor(this);
        if (!waitForUpgrade) {
            for (const child of this.composedLumeChildren)
                child.traverseSceneGraph(visitor, waitForUpgrade);
            return;
        }
        let promise = Promise.resolve();
        for (const child of this.composedLumeChildren) {
            const isUpgraded = child.matches(':defined');
            if (isUpgraded) {
                promise = promise.then(() => child.traverseSceneGraph(visitor, waitForUpgrade));
            }
            else {
                promise = promise
                    .then(() => customElements.whenDefined(child.tagName.toLowerCase()))
                    .then(() => child.traverseSceneGraph(visitor, waitForUpgrade));
            }
        }
        return promise;
    }
    _loadCSS() {
        if (!super._loadCSS())
            return false;
        this.createCSSEffect(() => {
            this._elementOperations.shouldRender = this.visible;
            this.needsUpdate();
        });
        return true;
    }
    _loadGL() {
        if (!super._loadGL())
            return false;
        this.createGLEffect(() => {
            this.three.visible = this.visible;
            this.needsUpdate();
        });
        return true;
    }
};
__decorate([
    booleanAttribute(true),
    __metadata("design:type", Object)
], Element3D.prototype, "visible", void 0);
Element3D = __decorate([
    element('lume-element3d', autoDefineElements),
    __metadata("design:paramtypes", [])
], Element3D);
export { Element3D };
Element3D.prototype.isElement3D = true;
//# sourceMappingURL=Element3D.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { untrack } from 'solid-js';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
import { Color } from 'three/src/math/Color.js';
import { DoubleSide, FrontSide, BackSide, SRGBColorSpace } from 'three/src/constants.js';
import { Material } from 'three/src/materials/Material.js';
import { reactive, booleanAttribute, stringAttribute, numberAttribute } from '../../attribute.js';
import { onCleanup } from 'solid-js';
import { GeometryOrMaterialBehavior } from '../GeometryOrMaterialBehavior.js';
let MaterialBehavior = class MaterialBehavior extends GeometryOrMaterialBehavior {
    type = 'material';
    alphaTest = 0;
    colorWrite = true;
    depthTest = true;
    depthWrite = true;
    dithering = false;
    fog = true;
    wireframe = false;
    sidedness = 'front';
    materialOpacity = 1;
    #color = new Color('white');
    get color() {
        return this.#color;
    }
    set color(val) {
        val = val ?? '';
        if (typeof val === 'string')
            this.#color.set(val);
        else if (typeof val === 'number')
            this.#color.set(val);
        else
            this.#color = val;
    }
    get transparent() {
        if (this.element.opacity < 1 || this.materialOpacity < 1)
            return true;
        else
            return false;
    }
    loadGL() {
        super.loadGL();
        this.createEffect(() => {
            const mat = this.meshComponent;
            if (!mat)
                return;
            mat.alphaTest = this.alphaTest;
            mat.colorWrite = this.colorWrite;
            mat.depthTest = this.depthTest;
            mat.depthWrite = this.depthWrite;
            mat.dithering = this.dithering;
            this.element.needsUpdate();
        });
        this.createEffect(() => {
            const mat = this.meshComponent;
            if (!(mat && 'wireframe' in mat))
                return;
            mat.wireframe = this.wireframe;
            this.element.needsUpdate();
        });
        this.createEffect(() => {
            const mat = this.meshComponent;
            if (!(mat && 'side' in mat))
                return;
            let side;
            switch (this.sidedness) {
                case 'front':
                    side = FrontSide;
                    break;
                case 'back':
                    side = BackSide;
                    break;
                case 'double':
                    side = DoubleSide;
                    break;
            }
            mat.side = side;
            this.element.needsUpdate();
        });
        this.createEffect(() => {
            const mat = this.meshComponent;
            if (!(mat && 'color' in mat))
                return;
            mat.color = this.color;
            this.element.needsUpdate();
        });
        this.createEffect(() => {
            const mat = this.meshComponent;
            if (!mat)
                return;
            mat.opacity = this.element.opacity * this.materialOpacity;
            mat.transparent = this.transparent;
            this.element.needsUpdate();
        });
    }
    _createComponent() {
        return new Material();
    }
    _handleTexture(textureUrl, setTexture, hasTexture, onLoad, isColor = false) {
        this.createEffect(() => {
            const mat = this.meshComponent;
            if (!mat)
                return;
            const url = textureUrl();
            if (url) {
                let cleaned = false;
                const texture = new TextureLoader().load(url, () => {
                    if (cleaned)
                        return;
                    if (!hasTexture(mat))
                        mat.needsUpdate = true;
                    setTexture(mat, texture);
                    this.element.needsUpdate();
                    onLoad?.();
                });
                if (isColor)
                    texture.colorSpace = SRGBColorSpace;
                onCleanup(() => {
                    cleaned = true;
                    texture.dispose();
                });
            }
            else {
                untrack(() => setTexture(mat, null));
            }
            mat.needsUpdate = true;
            this.element.needsUpdate();
        });
    }
};
__decorate([
    numberAttribute(0)
], MaterialBehavior.prototype, "alphaTest", void 0);
__decorate([
    booleanAttribute(true)
], MaterialBehavior.prototype, "colorWrite", void 0);
__decorate([
    booleanAttribute(true)
], MaterialBehavior.prototype, "depthTest", void 0);
__decorate([
    booleanAttribute(true)
], MaterialBehavior.prototype, "depthWrite", void 0);
__decorate([
    booleanAttribute(false)
], MaterialBehavior.prototype, "dithering", void 0);
__decorate([
    booleanAttribute(true)
], MaterialBehavior.prototype, "fog", void 0);
__decorate([
    booleanAttribute(false)
], MaterialBehavior.prototype, "wireframe", void 0);
__decorate([
    stringAttribute('front')
], MaterialBehavior.prototype, "sidedness", void 0);
__decorate([
    numberAttribute(1)
], MaterialBehavior.prototype, "materialOpacity", void 0);
__decorate([
    stringAttribute('white')
], MaterialBehavior.prototype, "color", null);
MaterialBehavior = __decorate([
    reactive
], MaterialBehavior);
export { MaterialBehavior };
//# sourceMappingURL=MaterialBehavior.js.map
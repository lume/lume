var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { element } from '@lume/element';
import { Element3D } from '../core/Element3D.js';
import { autoDefineElements } from '../LumeConfig.js';
import { XYZNonNegativeValues } from '../xyz-values/XYZNonNegativeValues.js';
import { XYZNumberValues } from '../xyz-values/XYZNumberValues.js';
let CubeLayout = class CubeLayout extends Element3D {
    #sides = [];
    hasShadow = true;
    #created = false;
    connectedCallback() {
        super.connectedCallback();
        if (this.#created)
            return;
        for (let n = 0; n < 6; n += 1)
            this.#createCubeSide(n);
        const defaultSlot = document.createElement('slot');
        this.root.appendChild(defaultSlot);
    }
    #createCubeSide(index) {
        const rotator = new Element3D().set({
            alignPoint: new XYZNumberValues(0.5, 0.5, 0.5),
        });
        const side = new Element3D().set({
            mountPoint: new XYZNumberValues(0.5, 0.5),
            size: new XYZNonNegativeValues(this.size.x, this.size.x),
        });
        this.#sides.push(side);
        rotator.append(side);
        const slot = document.createElement('slot');
        side.append(slot);
        slot.name =
            index === 0
                ? 'front'
                : index === 1
                    ? 'right'
                    : index === 2
                        ? 'back'
                        : index === 3
                            ? 'left'
                            : index === 4
                                ? 'top'
                                : 'bottom';
        if (index < 4)
            rotator.rotation.y = 90 * index;
        else
            rotator.rotation.x = 90 * (index % 2 ? -1 : 1);
        side.position.z = this.size.x / 2;
        this.root.appendChild(rotator);
    }
    setContent(content) {
        for (let index = 0; index < 6; index += 1) {
            this.#sides[index].innerHTML = '';
            this.#sides[index].append(content[index]);
        }
        return this;
    }
};
CubeLayout = __decorate([
    element('lume-cube-layout', autoDefineElements)
], CubeLayout);
export { CubeLayout };
//# sourceMappingURL=CubeLayout.js.map
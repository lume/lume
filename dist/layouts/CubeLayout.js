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
import { element } from '@lume/element';
import { Element3D } from '../core/Element3D.js';
import { autoDefineElements } from '../LumeConfig.js';
import { XYZNonNegativeValues } from '../xyz-values/XYZNonNegativeValues.js';
import { XYZNumberValues } from '../xyz-values/XYZNumberValues.js';
/**
 * @extends Element3D
 * @class CubeLayout -
 *
 * Element: `<lume-cube-layout>`
 *
 * A layout in which layout slots are six sides of a cube, facing outwards.
 *
 * Slots:
 *
 * - `front` - The front face of the cube layout.
 * - `back` - The back face of the cube layout.
 * - `left` - The left face of the cube layout.
 * - `right` - The right face of the cube layout.
 * - `top` - The top face of the cube layout.
 * - `bottom` - The bottom face of the cube layout.
 * - Default: The default slot is a catch-all for all other children, so they behave the same as children of a node without a shadow tree.
 */
// This class is written imperatively, as opposed to declaratively, for sake of
// example. It would be cleaner written declaratively, but it's not a big class.
let CubeLayout = (() => {
    let _classDecorators = [element('lume-cube-layout', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Element3D;
    var CubeLayout = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            CubeLayout = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #sides = [];
        // Use a ShadowRoot
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
        /**
         * @method createCubeSide - Creates one side of the cube.
         * @param {number} index - A number between 0 and 5 specifying which side to create.
         * @param {string} name - The name of the side.
         */
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
            // rotate and place each side.
            if (index < 4)
                // 4 sides
                rotator.rotation.y = 90 * index;
            // top/bottom
            else
                rotator.rotation.x = 90 * (index % 2 ? -1 : 1);
            side.position.z = this.size.x / 2;
            this.root.appendChild(rotator);
        }
        /**
         * @method setContent - As an imperative alternative to slotting, an array
         * of 6 children (any more are ignored) can be passed in to make them
         * children of the 6 sides of the cube layout. The order in which they are
         * added is front, right, back, left, top, bottom. Note, it can be easier to
         * assign nodes to slots by name, without worrying about their order.
         * @param {Array<Element3D>} content - An array containing [Node](../core/Node)
         * instances to place in the cube sides. Only the first 6 items are used,
         * the rest are ignored.
         * @returns {this}
         */
        setContent(content) {
            for (let index = 0; index < 6; index += 1) {
                this.#sides[index].innerHTML = '';
                this.#sides[index].append(content[index]);
            }
            return this;
        }
    };
    return CubeLayout = _classThis;
})();
export { CubeLayout };
//# sourceMappingURL=CubeLayout.js.map
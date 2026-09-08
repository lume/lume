var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
import { attribute, element, Element } from '@lume/element';
import { effect } from 'classy-solid';
import { Color } from 'three/src/math/Color.js';
import { AnyConstructor } from 'lowclass/dist/Constructor.js';
const isInstance = Symbol();
/**
 * @class Colorful - This mixin class provides a `color` attribute and JS
 * property that maps to a Three.js sub-object with a color. This allow re-use
 * of a color attribute implementation and reactivity to avoid repetition.
 *
 * The Base class passed in must extend (i.e. this mixin is for use only on
 * classes that extend) from @lume/element's Element base class (the default if
 * no Base is specified), as this mixin relies on features for implementation.
 */
// CONTINUE ^ I think the requirement for base class to be Element no longer
// holds, @element() can be used on any element class, f.e. HTMLElement, or
// even non-element classes (the attribute part won't do anything then). Verify
// and remove requirement.
export function Colorful(Base = Element, { path = '.three.color', failOnNonObject = false } = {}) {
    if (Base.prototype instanceof Colorful)
        throw new Error('Base class already extends Colorful, no need to apply the mixin again.');
    if (!(Base.prototype instanceof Element))
        throw new Error("Base class must extend from @lume/element's Element class.");
    const path_ = typeof path === 'string' ? path.split('.').filter(s => !!s) : path;
    let Colorful_ = (() => {
        let _classSuper = Base;
        let _instanceExtraInitializers = [];
        let _color_decorators;
        let _color_initializers = [];
        let _color_extraInitializers = [];
        let _colorEffect_decorators;
        return class Colorful_ extends _classSuper {
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                _color_decorators = [attribute];
                _colorEffect_decorators = [effect];
                __esDecorate(this, null, _colorEffect_decorators, { kind: "method", name: "colorEffect", static: false, private: false, access: { has: obj => "colorEffect" in obj, get: obj => obj.colorEffect }, metadata: _metadata }, null, _instanceExtraInitializers);
                __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: obj => "color" in obj, get: obj => obj.color, set: (obj, value) => { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
                if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            }
            // Use `any` to prevent subclass "has or is using private name" errors.
            get [isInstance]() {
                return true;
            }
            /**
             * @property {string | number | THREE.Color | [number, number, number]} color -
             *
             * `attribute`
             *
             * Default: `"white"`
             *
             * The color this element has.
             *
             * A string value can be any valid CSS color string, f.e. `"#ff6600"` or
             * `"rgb(10,20,30)"`.
             *
             * A number value should represent a hex color value, f.e. `0xff6600`.
             *
             * A tuple of three numbers represents a color as RGB with each value
             * between 0 and 1.
             *
             * A `THREE.Color` instance can be assigned, and it will replace any
             * pre-existing Color value upon assignment. Mutating the assigned
             * `THREE.Color` after assignment is non-reactive and will not update
             * rendering; assign the same value again to trigger reactivity to
             * update rendering, like so:
             *
             * ```js
             * el.color.set('blue') // not reactive, does not update rendering
             * el.color = el.color // trigger update to re-render
             * ```
             *
             * Setting a value other than a `THREE.Color` will update any underlying
             * `THREE.Color` object without re-creating it (only creating it
             * initially if it doesn't exist).
             */
            color = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _color_initializers, 'white'));
            colorEffect() {
                console.log('colorful effect');
                const color = this.color;
                // If a new Color object is provided, override the old value.
                if (typeof color === 'object' && !Array.isArray(color))
                    setPath(this, path_, color, failOnNonObject);
                // Otherwise .set the value onto the existing underlying Color (create it if it doesn't exist).
                else {
                    const normalized = Array.isArray(color) ? color : [color];
                    const existingColor = getPath(this, path_, failOnNonObject);
                    if (!existingColor)
                        setPath(this, path_, new Color(...normalized), failOnNonObject);
                    else
                        existingColor.set(...normalized);
                }
                ;
                this.needsUpdate?.();
            }
            constructor() {
                super(...arguments);
                __runInitializers(this, _color_extraInitializers);
            }
        };
    })();
    // Hack to pass through correct class type without the element decorator
    // causing "has or is using private name" errors when used as a decorator
    // inside a mixin class. We can't fix this in TypeScript without removing
    // `protected` and `private` key words from the Element class in
    // `@lume/element`.
    const Class = element({ autoDefine: false })(Colorful_);
    return Class; // pass the expected class type through.
}
function setPath(obj, path, value, failOnNonObject = false) {
    for (const key of path) {
        if (fail(obj, failOnNonObject))
            return;
        // If last key in path set the value
        if (key === path[path.length - 1])
            obj[key] = value;
        else
            obj = obj[key];
    }
}
function getPath(obj, path, failOnNonObject = false) {
    for (const key of path) {
        if (fail(obj, failOnNonObject))
            return;
        obj = obj[key];
    }
    return obj;
}
function fail(obj, failOnNonObject) {
    if (typeof obj !== 'object' || !obj) {
        if (failOnNonObject)
            throw new TypeError('Intermediary value in path not an object.');
        else
            return true;
    }
    return false;
}
//# sourceMappingURL=Colorful.js.map
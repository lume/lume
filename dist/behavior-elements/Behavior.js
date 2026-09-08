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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { css, Element as LumeElement, element } from '@lume/element';
import { effect, Effectful, signal } from 'classy-solid';
import { CompositionTracker } from '../core/CompositionTracker.js';
/**
 * @class Behavior
 * Base class for all behavior elements.
 *
 * Behavior elements are elements that interact with their composed parent
 * element in a certain way to add features to the composed parent element. It
 * is similar to entities and components in entity-component-system (ECS)
 * frameworks, but in this case the component (behavior) is an element that is a
 * composed child of the entity (composed parent element) that the component is
 * affecting.
 *
 * Because behavior elements are intended to affect their composed parent
 * element, they have no visual representation of their own, and do not render
 * anything themselves, with display:none styling by default. They are simply a
 * way to attach behavior to an element.
 *
 * Example:
 *
 * ```html
 * <some-element>
 *   <!-- Behavior elements are children of the element they affect. -->
 *   <some-behavior></some-behavior>
 *   <other-behavior></other-behavior>
 *
 *   <!-- The element's regular (visible) content. -->
 *   <div>regular content</div>
 * </some-element>
 * ```
 *
 * When `_awaitElementDefined` is `true`, it causes the behavior to wait until
 * the behavior's composed parent element is upgraded if it might be a custom
 * element (i.e. when the composed parent element has a hyphen in its name).
 *
 * The `_parentDefinedEffect` method can be defined by subclasses to define an
 * effect that runs once the composed parent is defined, and it will
 * additionally re-run on changes to any other used signals.
 *
 * Calls a subclass's `requiredParentType` method should return a list of
 * classes (constructors) of allowed types of composed parent elements that the
 * behavior can be operate on. If the composed parent element is not
 * `instanceof` the any class returned by `requiredParentType()`, then an error
 * is shown in console and `_parentDefinedEffect` will not run.
 *
 * Note! For TypeScript users, the type of `.composedParent` needs to be
 * declared in subclasses as a union that matches the classes returned by
 * `requiredParentType`.
 *
 * Example subclass to define a new behavior element:
 *
 * ```ts
 * class MyBehavior extends Behavior {
 *   declare readonly composedParent: MyElement | null
 *
 *   override requiredParentType() {
 *     return [MyElement]
 *   }
 *
 *   override _parentDefinedEffect(composedParent) {
 *     super._parentDefinedEffect(composedParent)
 *
 *     // ...do something with `composedParent` of verified type...
 *
 *     onCleanup(() => {
 *       // ...do cleanup with `composedParent`...
 *     })
 *   }
 * }
 * ```
 *
 * @extends HTMLElement
 */
let BehaviorEl = (() => {
    let _classDecorators = [element({ autoDefine: false })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = CompositionTracker(Effectful(LumeElement));
    let _instanceExtraInitializers = [];
    let _private_parentIsDefined_decorators;
    let _private_parentIsDefined_initializers = [];
    let _private_parentIsDefined_extraInitializers = [];
    let _private_parentIsDefined_descriptor;
    let _private_whenParentDefinedEffect_decorators;
    let _private_whenParentDefinedEffect_descriptor;
    let ___init_effects_ignore_decorators;
    let ___init_effects_ignore_initializers = [];
    let ___init_effects_ignore_extraInitializers = [];
    var BehaviorEl = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _private_parentIsDefined_decorators = [signal];
            _private_whenParentDefinedEffect_decorators = [effect];
            ___init_effects_ignore_decorators = [signal];
            __esDecorate(this, _private_parentIsDefined_descriptor = { get: __setFunctionName(function () { return this.#parentIsDefined_accessor_storage; }, "#parentIsDefined", "get"), set: __setFunctionName(function (value) { this.#parentIsDefined_accessor_storage = value; }, "#parentIsDefined", "set") }, _private_parentIsDefined_decorators, { kind: "accessor", name: "#parentIsDefined", static: false, private: true, access: { has: obj => #parentIsDefined in obj, get: obj => obj.#parentIsDefined, set: (obj, value) => { obj.#parentIsDefined = value; } }, metadata: _metadata }, _private_parentIsDefined_initializers, _private_parentIsDefined_extraInitializers);
            __esDecorate(this, _private_whenParentDefinedEffect_descriptor = { value: __setFunctionName(function () {
                    if (!this.#parentIsDefined)
                        return;
                    this._parentDefinedEffect(this.composedParent);
                }, "#whenParentDefinedEffect") }, _private_whenParentDefinedEffect_decorators, { kind: "method", name: "#whenParentDefinedEffect", static: false, private: true, access: { has: obj => #whenParentDefinedEffect in obj, get: obj => obj.#whenParentDefinedEffect }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, ___init_effects_ignore_decorators, { kind: "field", name: "__init_effects_ignore", static: false, private: false, access: { has: obj => "__init_effects_ignore" in obj, get: obj => obj.__init_effects_ignore, set: (obj, value) => { obj.__init_effects_ignore = value; } }, metadata: _metadata }, ___init_effects_ignore_initializers, ___init_effects_ignore_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            BehaviorEl = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /**
         * If true, elementBehaviors will wait for a parent custom element to be
         * defined before setting _parentIsDefined to true on the behavior. The
         * behavior can use this signal to wait until the parent element is defined
         * and upgraded before trying to access it in `createEffect()`.
         */
        _awaitElementDefined = (__runInitializers(this, _instanceExtraInitializers), true);
        #parentIsDefined_accessor_storage = __runInitializers(this, _private_parentIsDefined_initializers, false
        /**
         * @method requiredParentType - A subclass can override this method in
         * order to enforce that the behavior can be applied only on certain types
         * of elements by returning an array of constructors. An error will be
         * thrown if `this.element` is not an instanceof one of the constructors.
         *
         * If the element's tag name has a hyphen in it, the logic will consider it
         * to possibly be a custom element and will wait for it to be upgraded
         * before performing the check; if the custom element is not upgraded within
         * a second, an error is thrown.
         *
         * @returns {(typeof LumeElement)[]}
         */
        );
        get #parentIsDefined() { return _private_parentIsDefined_descriptor.get.call(this); }
        set #parentIsDefined(value) { return _private_parentIsDefined_descriptor.set.call(this, value); }
        /**
         * @method requiredParentType - A subclass can override this method in
         * order to enforce that the behavior can be applied only on certain types
         * of elements by returning an array of constructors. An error will be
         * thrown if `this.element` is not an instanceof one of the constructors.
         *
         * If the element's tag name has a hyphen in it, the logic will consider it
         * to possibly be a custom element and will wait for it to be upgraded
         * before performing the check; if the custom element is not upgraded within
         * a second, an error is thrown.
         *
         * @returns {(typeof LumeElement)[]}
         */
        requiredParentType() {
            return [Element];
        }
        #uncomposedPromise = (__runInitializers(this, _private_parentIsDefined_extraInitializers), null);
        // @ts-expect-error private effect
        get #whenParentDefinedEffect() { return _private_whenParentDefinedEffect_descriptor.value; }
        composedCallback(composedParent, compositionType) {
            super.composedCallback?.(composedParent, compositionType);
            const parent = composedParent;
            if (this._awaitElementDefined && parent.tagName.includes('-')) {
                this.#uncomposedPromise = Promise.withResolvers();
                Promise.race([
                    customElements.whenDefined(parent.tagName.toLowerCase()),
                    // if the element isn't defined in 1 second, something is
                    // probably wrong (like a typo in the tag name, or the user
                    // forgot to define the element), so we throw an error in checkElementType.
                    new Promise(r => setTimeout(r, 1000)),
                    this.#uncomposedPromise.promise,
                ]).then(() => {
                    if (!this.composedParent)
                        return;
                    // @prod-prune
                    this.#checkElementType();
                    this.#parentIsDefined = true;
                });
            }
            else {
                // @prod-prune
                this.#checkElementType();
                this.#parentIsDefined = true;
            }
        }
        uncomposedCallback(uncomposedParent, compositionType) {
            super.uncomposedCallback?.(uncomposedParent, compositionType);
            this.#uncomposedPromise?.resolve();
            this.#uncomposedPromise = null;
            this.#parentIsDefined = false;
        }
        /**
         * @protected
         * @method _parentDefinedEffect - Subclasses can provide this method instead
         * of using connectedCallback to create effects that run only when both the
         * composed parent is known and the composed parent is defined if it is a
         * custom element (with a dash in its name).
         *
         * This method is an effect. Any signals accessed in this method will make
         * it re-run. onCleanup can be used to do cleanup when the effect re-runs or
         * when the behavior is disconnected.
         *
         * Example:
         *
         * ```ts
         * @element
         * class MyBehavior extends Behavior {
         *   override _parentDefinedEffect() {
         *     const [someSignal, setSomeSignal] = createSignal(0)
         *
         *     const interval = setInterval(() => setSomeSignal(s => s + 1), 1000)
         *     onCleanup(() => clearInterval(interval))
         *
         *     const parent = this.composedParent!
         *
         *     // Do something with parent (which is now guaranteed to be defined
         *     // and of the correct type).
         *     createEffect(() => parent.someProp = someSignal())
         *   }
         * }
         * ```
         *
         * @param {NonNullable<this['composedParent']>} composedParent The composed
         * parent element, guaranteed to be defined and of the correct type as
         * specified by `requiredParentType()`.
         */
        _parentDefinedEffect(composedParent = this.composedParent) {
            composedParent;
        }
        // Checks composedParent is the type specified by a subclass's requiredParentType.
        // TODO add a test to make sure this check works
        // @prod-prune
        #checkElementType() {
            const element = this.composedParent;
            const classes = this.requiredParentType();
            const correctElementType = classes.some(Class => element instanceof Class);
            if (!correctElementType) {
                thro(`
				Either the parent element you're using the behavior with
				(<${element.tagName.toLowerCase()}>) is not an instance of one
				of the allowed classes returned by \`requiredParentType\`, or
				there was a 1-second timeout waiting for the parent element to
				be defined. Please make sure all elements you intend to use are
				defined. The allowed classes are:
				`, classes);
            }
        }
        css = css `
		:host {
			display: none;
		}
	`;
        // @ts-expect-error Dummy signal field finalizes effects after private fields to prevent TDZ
        __init_effects_ignore = __runInitializers(this, ___init_effects_ignore_initializers, 0);
        constructor() {
            super(...arguments);
            __runInitializers(this, ___init_effects_ignore_extraInitializers);
        }
    };
    return BehaviorEl = _classThis;
})();
export { BehaviorEl };
function thro(msg, classes) {
    console.error(msg, classes);
    throw new Error(`${msg}\n\n${classes.map(c => c.name).join(', ')}`);
}
//# sourceMappingURL=Behavior.js.map
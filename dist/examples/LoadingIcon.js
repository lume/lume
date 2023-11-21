/* TODO @jsxImportSource @lume/element */
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
// Find a standalone version of this loading icon at
// https://codepen.io/trusktr/pen/poNxzqJ
import html from 'solid-js/html';
import { Element, element, stringAttribute } from '@lume/element';
import { autoDefineElements } from '../LumeConfig.js';
const defaultColor = '120,130,140';
let LoadingIcon = (() => {
    let _classDecorators = [element('loading-icon', autoDefineElements)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Element;
    let _instanceExtraInitializers = [];
    let _color_decorators;
    let _color_initializers = [];
    var LoadingIcon = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _color_decorators = [stringAttribute];
            __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: obj => "color" in obj, get: obj => obj.color, set: (obj, value) => { obj.color = value; } }, metadata: _metadata }, _color_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            LoadingIcon = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        /** A string with an RGB triplet, comma separated. */
        color = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _color_initializers, defaultColor
        // TODO convert to JSX.
        ));
        // TODO convert to JSX.
        template = () => html `
		<>
			<div class="top"></div>
			<div class="right"></div>
			<div class="bottom"></div>
			<div class="left"></div>
		</>
	`;
        css = /*css*/ `
		:host {
			--loading-icon-color: ${this.color};
		}

		.top, .right, .bottom, .left {
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: 50%;
			opacity: 0;
			border: 8px solid rgba(var(--loading-icon-color), 0);
		}
		.top {
			border-top-color: rgba(var(--loading-icon-color), 1);
			animation: fade 1s 0s infinite;
		}
		.right {
			border-right-color: rgba(var(--loading-icon-color), 1);
			animation: fade 1s 0.25s infinite;
		}
		.bottom {
			border-bottom-color: rgba(var(--loading-icon-color), 1);
			animation: fade 1s 0.5s infinite;
		}
		.left {
			border-left-color: rgba(var(--loading-icon-color), 1);
			animation: fade 1s 0.75s infinite;
		}
		@keyframes fade {
			0% { opacity: 0; }
			50% { opacity: 1; }
			100% { opacity: 0; }
		}
	`;
    };
    return LoadingIcon = _classThis;
})();
export { LoadingIcon };
//# sourceMappingURL=LoadingIcon.js.map
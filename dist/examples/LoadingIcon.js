var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import html from 'solid-js/html';
import { Element, element, stringAttribute } from '@lume/element';
import { autoDefineElements } from '../LumeConfig.js';
const defaultColor = '120,130,140';
let LoadingIcon = class LoadingIcon extends Element {
    color = defaultColor;
    template = () => html `
		<>
			<div class="top"></div>
			<div class="right"></div>
			<div class="bottom"></div>
			<div class="left"></div>
		</>
	`;
    css = `
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
__decorate([
    stringAttribute(defaultColor)
], LoadingIcon.prototype, "color", void 0);
LoadingIcon = __decorate([
    element('loading-icon', autoDefineElements)
], LoadingIcon);
export { LoadingIcon };
//# sourceMappingURL=LoadingIcon.js.map
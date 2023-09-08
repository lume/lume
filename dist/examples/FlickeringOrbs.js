var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import html from 'solid-js/html';
import { element, numberAttribute } from '@lume/element';
import { autoDefineElements } from '../LumeConfig.js';
import { Element3D } from '../core/Element3D.js';
let FlickeringOrbs = class FlickeringOrbs extends Element3D {
    shadowBias = 0;
    template = () => html `
		<flickering-orb color="yellow" position="500 0 0" attr:shadow-bias=${() => this.shadowBias}></flickering-orb>
		<flickering-orb color="deeppink" position="-500 0 0" attr:shadow-bias=${() => this.shadowBias}></flickering-orb>
		<flickering-orb color="cyan" position="0 0 500" attr:shadow-bias=${() => this.shadowBias}></flickering-orb>
		<flickering-orb color="limegreen" position="0 0 -500" attr:shadow-bias=${() => this.shadowBias}></flickering-orb>
		<flickering-orb color="white" position="0 -500 0" attr:shadow-bias=${() => this.shadowBias}></flickering-orb>
		<flickering-orb color="white" position="0 250 0" attr:shadow-bias=${() => this.shadowBias}></flickering-orb>
	`;
};
__decorate([
    numberAttribute(0),
    __metadata("design:type", Object)
], FlickeringOrbs.prototype, "shadowBias", void 0);
FlickeringOrbs = __decorate([
    element('flickering-orbs', autoDefineElements)
], FlickeringOrbs);
export { FlickeringOrbs };
//# sourceMappingURL=FlickeringOrbs.js.map
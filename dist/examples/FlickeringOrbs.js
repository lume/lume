var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import html from 'solid-js/html';
import { element, attribute, numberAttribute } from '@lume/element';
import { autoDefineElements } from '../LumeConfig.js';
import { Element3D } from '../core/Element3D.js';
let FlickeringOrbs = class FlickeringOrbs extends Element3D {
    shadowBias = 0;
    intensity = 1.3;
    flickerRange = 0.4;
    color = null;
    template = () => html `
		<flickering-orb flicker-range=${() => this.flickerRange} intensity=${() => this.intensity} shadow-bias=${() => this.shadowBias} color=${() => this.color ?? "yellow"} position="500 0 0"></flickering-orb>
		<flickering-orb flicker-range=${() => this.flickerRange} intensity=${() => this.intensity} shadow-bias=${() => this.shadowBias} color=${() => this.color ?? "deeppink"} position="-500 0 0"></flickering-orb>
		<flickering-orb flicker-range=${() => this.flickerRange} intensity=${() => this.intensity} shadow-bias=${() => this.shadowBias} color=${() => this.color ?? "cyan"} position="0 0 500"></flickering-orb>
		<flickering-orb flicker-range=${() => this.flickerRange} intensity=${() => this.intensity} shadow-bias=${() => this.shadowBias} color=${() => this.color ?? "limegreen"} position="0 0 -500"></flickering-orb>
		<flickering-orb flicker-range=${() => this.flickerRange} intensity=${() => this.intensity} shadow-bias=${() => this.shadowBias} color=${() => this.color ?? "white"} position="0 -500 0"></flickering-orb>
		<flickering-orb flicker-range=${() => this.flickerRange} intensity=${() => this.intensity} shadow-bias=${() => this.shadowBias} color=${() => this.color ?? "white"} position="0 250 0"></flickering-orb>
	`;
};
__decorate([
    numberAttribute(0)
], FlickeringOrbs.prototype, "shadowBias", void 0);
__decorate([
    numberAttribute(1.3)
], FlickeringOrbs.prototype, "intensity", void 0);
__decorate([
    numberAttribute(0.4)
], FlickeringOrbs.prototype, "flickerRange", void 0);
__decorate([
    attribute
], FlickeringOrbs.prototype, "color", void 0);
FlickeringOrbs = __decorate([
    element('flickering-orbs', autoDefineElements)
], FlickeringOrbs);
export { FlickeringOrbs };
//# sourceMappingURL=FlickeringOrbs.js.map
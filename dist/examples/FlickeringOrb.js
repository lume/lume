var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import html from 'solid-js/html';
import { element, numberAttribute, stringAttribute } from '@lume/element';
import { autoDefineElements } from '../LumeConfig.js';
import { Element3D } from '../core/Element3D.js';
import { Motor } from '../core/Motor.js';
let FlickeringOrb = class FlickeringOrb extends Element3D {
    color = 'royalblue';
    intensity = 1.3;
    shadowBias = 0;
    flickerRange = 0.4;
    shadowMapWidth = 512;
    shadowMapHeight = 512;
    light;
    sphere;
    template = () => html `
		<lume-point-light
			ref=${(l) => (this.light = l)}
			color=${() => this.color}
			intensity=${() => this.intensity}
			shadow-bias=${() => this.shadowBias}
			shadow-map-width=${() => this.shadowMapWidth}
			shadow-map-height=${() => this.shadowMapHeight}
		>
			<lume-sphere
				ref=${(s) => (this.sphere = s)}
				has="basic-material"
				color=${() => this.color}
				opacity="0.5"
				mount-point="0.5 0.5 0.5"
				size="10 10 10"
				cast-shadow="false"
				receive-shadow="false"
			></lume-sphere>
		</lume-point-light>
	`;
    connectedCallback() {
        super.connectedCallback();
        const initialIntensity = this.intensity;
        const initialOpacity = this.opacity;
        const flickerFunction = () => {
            const flicker = Math.random() - 1;
            this.light.intensity = initialIntensity + flicker * this.flickerRange;
            this.sphere.opacity = initialOpacity + flicker * 0.4;
            setTimeout(() => Motor.once(flickerFunction), Math.random() * 100);
        };
        Motor.once(flickerFunction);
    }
};
__decorate([
    stringAttribute('royalblue')
], FlickeringOrb.prototype, "color", void 0);
__decorate([
    numberAttribute(1.3)
], FlickeringOrb.prototype, "intensity", void 0);
__decorate([
    numberAttribute(0)
], FlickeringOrb.prototype, "shadowBias", void 0);
__decorate([
    numberAttribute(0.4)
], FlickeringOrb.prototype, "flickerRange", void 0);
__decorate([
    numberAttribute(512)
], FlickeringOrb.prototype, "shadowMapWidth", void 0);
__decorate([
    numberAttribute(512)
], FlickeringOrb.prototype, "shadowMapHeight", void 0);
FlickeringOrb = __decorate([
    element('flickering-orb', autoDefineElements)
], FlickeringOrb);
export { FlickeringOrb };
//# sourceMappingURL=FlickeringOrb.js.map
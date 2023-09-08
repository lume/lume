var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { createEffect, onCleanup, untrack } from 'solid-js';
import html from 'solid-js/html';
import { element, numberAttribute, autorun, booleanAttribute, reactive } from '@lume/element';
import { autoDefineElements } from '../LumeConfig.js';
import { Element3D } from '../core/Element3D.js';
import { FlingRotation, ScrollFling, PinchFling } from '../interaction/index.js';
let CameraRig = class CameraRig extends Element3D {
    hasShadow = true;
    initialPolarAngle = 0;
    minPolarAngle = -90;
    maxPolarAngle = 90;
    minHorizontalAngle = -Infinity;
    maxHorizontalAngle = Infinity;
    initialDistance = 1000;
    minDistance = 200;
    maxDistance = 2000;
    active = true;
    dollySpeed = 1;
    interactive = true;
    cam;
    rotationYTarget;
    template = () => html `
		<lume-element3d
			id="cameraY"
			size="1 1 1"
			ref=${(el) => (this.rotationYTarget = el)}
			size-mode="proportional proportional proportional"
		>
			<lume-element3d
				id="cameraX"
				size="1 1 1"
				rotation=${() => untrack(() => [this.initialPolarAngle, 0, 0])}
				size-mode="proportional proportional proportional"
			>
				<slot
					name="camera"
					TODO="determine semantics for overriding the internal camera (this slot is not documented yet)"
				>
					<lume-perspective-camera
						ref=${(cam) => (this.cam = cam)}
						active=${() => this.active}
						position=${[0, 0, this.initialDistance]}
						align-point="0.5 0.5 0.5"
						far="10000"
					>
						<slot name="camera-child"></slot>
					</lume-perspective-camera>
				</slot>
			</lume-element3d>
		</lume-element3d>

		<slot></slot>
	`;
    flingRotation = null;
    scrollFling = null;
    pinchFling = null;
    autorunStoppers;
    #startedInteraction = false;
    startInteraction() {
        if (this.#startedInteraction)
            return;
        this.#startedInteraction = true;
        this.autorunStoppers = [];
        this.autorunStoppers.push(autorun(() => {
            if (!(this.scene && this.rotationYTarget))
                return;
            const flingRotation = (this.flingRotation = new FlingRotation({
                interactionInitiator: this.scene,
                rotationYTarget: this.rotationYTarget,
                minFlingRotationX: this.minPolarAngle,
                maxFlingRotationX: this.maxPolarAngle,
                minFlingRotationY: this.minHorizontalAngle,
                maxFlingRotationY: this.maxHorizontalAngle,
            }).start());
            createEffect(() => {
                if (this.interactive && !this.pinchFling?.interacting)
                    flingRotation.start();
                else
                    flingRotation.stop();
            });
            onCleanup(() => flingRotation?.stop());
        }), autorun(() => {
            if (!this.scene)
                return;
            const scrollFling = (this.scrollFling = new ScrollFling({
                target: this.scene,
                y: this.initialDistance,
                minY: this.minDistance,
                maxY: this.maxDistance,
                scrollFactor: this.dollySpeed,
            }).start());
            const pinchFling = (this.pinchFling = new PinchFling({
                target: this.scene,
                x: this.initialDistance,
                minX: this.minDistance,
                maxX: this.maxDistance,
                factor: this.dollySpeed,
            }).start());
            createEffect(() => {
                const cam = this.cam;
                if (!cam)
                    return;
                untrack(() => cam.position).z = scrollFling.y;
            });
            createEffect(() => {
                const cam = this.cam;
                if (!cam)
                    return;
                untrack(() => cam.position).z = pinchFling.x;
            });
            createEffect(() => {
                if (this.interactive) {
                    scrollFling.start();
                    pinchFling.start();
                }
                else {
                    scrollFling.stop();
                    pinchFling.stop();
                }
            });
            onCleanup(() => {
                scrollFling.stop();
                pinchFling.stop();
            });
        }));
    }
    stopInteraction() {
        if (!this.#startedInteraction)
            return;
        this.#startedInteraction = false;
        if (this.autorunStoppers)
            for (const stop of this.autorunStoppers)
                stop();
    }
    _loadGL() {
        if (!super._loadGL())
            return false;
        this.startInteraction();
        return true;
    }
    _loadCSS() {
        if (!super._loadCSS())
            return false;
        this.startInteraction();
        return true;
    }
    _unloadGL() {
        if (!super._unloadGL())
            return false;
        if (!this.glLoaded && !this.cssLoaded)
            this.stopInteraction();
        return true;
    }
    _unloadCSS() {
        if (!super._unloadCSS())
            return false;
        if (!this.glLoaded && !this.cssLoaded)
            this.stopInteraction();
        return true;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.stopInteraction();
    }
};
__decorate([
    numberAttribute(0),
    __metadata("design:type", Object)
], CameraRig.prototype, "initialPolarAngle", void 0);
__decorate([
    numberAttribute(-90),
    __metadata("design:type", Object)
], CameraRig.prototype, "minPolarAngle", void 0);
__decorate([
    numberAttribute(90),
    __metadata("design:type", Object)
], CameraRig.prototype, "maxPolarAngle", void 0);
__decorate([
    numberAttribute(-Infinity),
    __metadata("design:type", Object)
], CameraRig.prototype, "minHorizontalAngle", void 0);
__decorate([
    numberAttribute(Infinity),
    __metadata("design:type", Object)
], CameraRig.prototype, "maxHorizontalAngle", void 0);
__decorate([
    numberAttribute(1000),
    __metadata("design:type", Object)
], CameraRig.prototype, "initialDistance", void 0);
__decorate([
    numberAttribute(200),
    __metadata("design:type", Object)
], CameraRig.prototype, "minDistance", void 0);
__decorate([
    numberAttribute(2000),
    __metadata("design:type", Object)
], CameraRig.prototype, "maxDistance", void 0);
__decorate([
    booleanAttribute(true),
    __metadata("design:type", Object)
], CameraRig.prototype, "active", void 0);
__decorate([
    numberAttribute(1),
    __metadata("design:type", Object)
], CameraRig.prototype, "dollySpeed", void 0);
__decorate([
    booleanAttribute(true),
    __metadata("design:type", Object)
], CameraRig.prototype, "interactive", void 0);
__decorate([
    reactive,
    __metadata("design:type", Function)
], CameraRig.prototype, "cam", void 0);
__decorate([
    reactive,
    __metadata("design:type", Element3D)
], CameraRig.prototype, "rotationYTarget", void 0);
__decorate([
    reactive,
    __metadata("design:type", Object)
], CameraRig.prototype, "flingRotation", void 0);
__decorate([
    reactive,
    __metadata("design:type", Object)
], CameraRig.prototype, "scrollFling", void 0);
__decorate([
    reactive,
    __metadata("design:type", Object)
], CameraRig.prototype, "pinchFling", void 0);
CameraRig = __decorate([
    element('lume-camera-rig', autoDefineElements)
], CameraRig);
export { CameraRig };
//# sourceMappingURL=CameraRig.js.map
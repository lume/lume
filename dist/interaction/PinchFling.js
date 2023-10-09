var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { createSignal, untrack } from 'solid-js';
import { reactive } from '@lume/element';
import { Motor } from '../core/Motor.js';
import { clamp } from '../math/clamp.js';
let PinchFling = class PinchFling {
    x = 0;
    minX = -Infinity;
    maxX = Infinity;
    target = document;
    factor = 1;
    #task;
    #interacting = (() => {
        const { 0: get, 1: set } = createSignal(false);
        return { get, set };
    })();
    get interacting() {
        return this.#interacting.get();
    }
    #isStarted = (() => {
        const { 0: get, 1: set } = createSignal(false);
        return { get, set };
    })();
    get isStarted() {
        return this.#isStarted.get();
    }
    #aborter = new AbortController();
    constructor(options) {
        Object.assign(this, options);
    }
    #onPinch = (dx) => {
        dx = dx * this.factor;
        this.x = clamp(this.x + dx, this.minX, this.maxX);
        if (dx === 0)
            return;
        if (this.#task)
            Motor.removeRenderTask(this.#task);
        this.#task = Motor.addRenderTask(() => {
            dx = dx * 0.95;
            this.x = clamp(this.x + dx, this.minX, this.maxX);
            if (Math.abs(dx) < 0.01)
                return false;
        });
    };
    #pointers = new Map();
    #onDown = (event) => {
        event.clientX;
        this.#pointers.set(event.pointerId, {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
        });
        if (this.#pointers.size === 2) {
            document.addEventListener('pointermove', this.#onMove, { signal: this.#aborter.signal });
            this.#interacting.set(true);
        }
    };
    #lastDistance = -1;
    #onMove = (event) => {
        if (!this.#pointers.has(event.pointerId))
            return;
        if (this.#pointers.size < 2)
            return;
        const [one, two] = this.#pointers.values();
        if (event.pointerId === one.id) {
            one.x = event.clientX;
            one.y = event.clientY;
        }
        else {
            two.x = event.clientX;
            two.y = event.clientY;
        }
        const distance = Math.abs(Math.sqrt((two.x - one.x) ** 2 + (two.y - one.y) ** 2));
        if (this.#lastDistance === -1)
            this.#lastDistance = distance;
        const dx = this.#lastDistance - distance;
        this.#onPinch(dx);
        this.#lastDistance = distance;
    };
    #onUp = (event) => {
        if (!this.#pointers.has(event.pointerId))
            return;
        this.#pointers.delete(event.pointerId);
        this.#lastDistance = -1;
        if (this.#pointers.size === 1) {
            document.removeEventListener('pointermove', this.#onMove);
            this.#interacting.set(false);
        }
    };
    start() {
        if (untrack(this.#isStarted.get))
            return this;
        this.#isStarted.set(true);
        this.target.addEventListener('pointerdown', this.#onDown, { signal: this.#aborter.signal });
        this.target.addEventListener('pointerup', this.#onUp, { signal: this.#aborter.signal });
        return this;
    }
    stop() {
        if (!untrack(this.#isStarted.get))
            return this;
        this.#isStarted.set(false);
        if (this.#task)
            Motor.removeRenderTask(this.#task);
        this.#aborter.abort();
        return this;
    }
};
__decorate([
    reactive,
    __metadata("design:type", Object)
], PinchFling.prototype, "x", void 0);
PinchFling = __decorate([
    reactive,
    __metadata("design:paramtypes", [Object])
], PinchFling);
export { PinchFling };
//# sourceMappingURL=PinchFling.js.map
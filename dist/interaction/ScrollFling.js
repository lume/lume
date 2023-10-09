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
let ScrollFling = class ScrollFling {
    x = 0;
    y = 0;
    minX = -Infinity;
    maxX = Infinity;
    minY = -Infinity;
    maxY = Infinity;
    target = document;
    scrollFactor = 1;
    #task;
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
    #onWheel = (event) => {
        event.preventDefault();
        let dx = event.deltaX * this.scrollFactor;
        let dy = event.deltaY * this.scrollFactor;
        this.x = clamp(this.x + dx, this.minX, this.maxX);
        this.y = clamp(this.y + dy, this.minY, this.maxY);
        if (dx === 0 && dy === 0)
            return;
        if (this.#task)
            Motor.removeRenderTask(this.#task);
        this.#task = Motor.addRenderTask(() => {
            dx = dx * 0.95;
            dy = dy * 0.95;
            this.x = clamp(this.x + dx, this.minX, this.maxX);
            this.y = clamp(this.y + dy, this.minY, this.maxY);
            if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01)
                return false;
        });
    };
    start() {
        if (untrack(this.#isStarted.get))
            return this;
        this.#isStarted.set(true);
        this.target.addEventListener('wheel', this.#onWheel, { signal: this.#aborter.signal });
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
], ScrollFling.prototype, "x", void 0);
__decorate([
    reactive,
    __metadata("design:type", Object)
], ScrollFling.prototype, "y", void 0);
ScrollFling = __decorate([
    reactive,
    __metadata("design:paramtypes", [Object])
], ScrollFling);
export { ScrollFling };
//# sourceMappingURL=ScrollFling.js.map
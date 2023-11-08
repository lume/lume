import { clamp } from '../math/clamp.js';
export class FlingRotation {
    rotationYTarget;
    rotationXTarget;
    interactionInitiator;
    minFlingRotationX = -90;
    maxFlingRotationX = 90;
    minFlingRotationY = -Infinity;
    maxFlingRotationY = Infinity;
    interactionContainer = document;
    factor = 1;
    #aborter = new AbortController();
    constructor(options) {
        Object.assign(this, options);
        if (!this.rotationXTarget)
            this.rotationXTarget = this.rotationYTarget.children[0];
        if (!this.interactionInitiator)
            this.interactionInitiator = this.rotationXTarget;
    }
    #onMove;
    #onPointerUp;
    #mainPointer = -1;
    #pointerCount = 0;
    #lastX = 0;
    #lastY = 0;
    #onPointerDown = (event) => {
        this.#pointerCount++;
        if (this.#pointerCount === 1)
            this.#mainPointer = event.pointerId;
        else
            return;
        this.rotationXTarget.rotation = () => false;
        this.rotationYTarget.rotation = () => false;
        this.#lastX = event.x;
        this.#lastY = event.y;
        let deltaX = 0;
        let deltaY = 0;
        this.#onMove = (event) => {
            if (event.pointerId !== this.#mainPointer)
                return;
            const movementX = event.x - this.#lastX;
            const movementY = event.y - this.#lastY;
            this.#lastX = event.x;
            this.#lastY = event.y;
            deltaX = movementY * 0.15 * this.factor;
            this.rotationXTarget.rotation.x = clamp(this.rotationXTarget.rotation.x + deltaX, this.minFlingRotationX, this.maxFlingRotationX);
            deltaY = -movementX * 0.15 * this.factor;
            this.rotationYTarget.rotation.y = clamp(this.rotationYTarget.rotation.y + deltaY, this.minFlingRotationY, this.maxFlingRotationY);
        };
        this.interactionContainer.addEventListener('pointermove', this.#onMove, { signal: this.#aborter.signal });
        this.interactionContainer.addEventListener('pointerup', (this.#onPointerUp = () => {
            this.#pointerCount--;
            const mainPointer = this.#mainPointer;
            if (this.#pointerCount === 0) {
                this.#mainPointer = -1;
                this.interactionContainer.removeEventListener('pointerup', this.#onPointerUp);
            }
            if (event.pointerId !== mainPointer)
                return;
            this.interactionContainer.removeEventListener('pointermove', this.#onMove);
            if (deltaX === 0 && deltaY === 0)
                return;
            this.rotationXTarget.rotation = (x, y, z) => {
                deltaX = deltaX * 0.95;
                if (Math.abs(deltaX) < 0.01)
                    return false;
                return [clamp(x + deltaX, this.minFlingRotationX, this.maxFlingRotationX), y, z];
            };
            this.rotationYTarget.rotation = (x, y, z) => {
                deltaY = deltaY * 0.95;
                if (Math.abs(deltaY) < 0.01)
                    return false;
                return [x, clamp(y + deltaY, this.minFlingRotationY, this.maxFlingRotationY), z];
            };
        }), { signal: this.#aborter.signal });
    };
    #onDragStart = (event) => event.preventDefault();
    #isStarted = false;
    start() {
        if (this.#isStarted)
            return this;
        this.#isStarted = true;
        this.interactionInitiator.addEventListener('pointerdown', this.#onPointerDown, { signal: this.#aborter.signal });
        this.interactionInitiator.addEventListener('dragstart', this.#onDragStart, { signal: this.#aborter.signal });
        this.interactionInitiator.addEventListener('pointercancel', () => {
            throw new Error('Pointercancel should not be happening. If so, please open a bug report.');
        }, { signal: this.#aborter.signal });
        return this;
    }
    stop() {
        if (!this.#isStarted)
            return this;
        this.#isStarted = false;
        this.#mainPointer = -1;
        this.#pointerCount = 0;
        this.rotationXTarget.rotation = () => false;
        this.rotationYTarget.rotation = () => false;
        this.#aborter.abort();
        return this;
    }
}
//# sourceMappingURL=FlingRotation.js.map
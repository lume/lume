import { clamp } from '../math/clamp.js';
export class FlingRotation {
    /** The object that will be rotated on Y. Required. */
    rotationYTarget;
    /**
     * The object that will be rotated on X. Defaults to the element inside the
     * rotationYTarget (it's like a gimball).
     */
    rotationXTarget;
    /**
     * The element on which the pointer should be placed down on in order to
     * initiate drag tracking. This defaults to rotationXTarget.
     */
    interactionInitiator;
    /**
     * The X rotation can not go below this value. Defaults to -90 which means
     * facing straight up.
     */
    minFlingRotationX = -90;
    /**
     * The X rotation can not go above this value. Defaults to 90 which means
     * facing straight down.
     */
    maxFlingRotationX = 90;
    /**
     * The Y rotation can not go below this value. Defaults to -Infinity which
     * means the camera can keep rotating laterally around the focus point
     * indefinitely.
     */
    minFlingRotationY = -Infinity;
    /**
     * The Y rotation can not go below this value. Defaults to Infinity which
     * means the camera can keep rotating laterally around the focus point
     * indefinitely.
     */
    maxFlingRotationY = Infinity;
    /**
     * The area in which drag tacking will happen. Defaults to
     * document.documentElement for tracking in the whole viewport.
     */
    interactionContainer = document.documentElement;
    factor = 1;
    #aborter = new AbortController();
    constructor(options) {
        Object.assign(this, options);
        // FlingRotation is dependent on tree structure (unless otherwise
        // specified by the input options), at least for now.
        if (!this.rotationXTarget)
            this.rotationXTarget = this.rotationYTarget.children[0];
        if (!this.interactionInitiator)
            this.interactionInitiator = this.rotationXTarget;
    }
    #mainPointer = -1;
    #pointerCount = 0;
    // The last X/Y only for a single pointer (the rest are ignored).
    #lastX = 0;
    #lastY = 0;
    #deltaX = 0;
    #deltaY = 0;
    #onPointerDown = (event) => {
        event.preventDefault();
        this.#pointerCount++;
        if (this.#pointerCount === 1)
            this.#mainPointer = event.pointerId;
        else
            return;
        this.interactionContainer.setPointerCapture(this.#mainPointer);
        // Stop rotation if any.
        this.rotationXTarget.rotation = () => false;
        this.rotationYTarget.rotation = () => false;
        this.#lastX = event.x;
        this.#lastY = event.y;
        this.#deltaX = 0;
        this.#deltaY = 0;
        // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
        this.interactionContainer.addEventListener('pointermove', this.#onMove, { signal: this.#aborter.signal });
        // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
        this.interactionContainer.addEventListener('pointerup', this.#onPointerUp, { signal: this.#aborter.signal });
    };
    #onMove = (event) => {
        event.preventDefault();
        if (event.pointerId !== this.#mainPointer)
            return;
        // We're not simply using event.movementX and event.movementY
        // because of a Safari bug:
        // https://bugs.webkit.org/show_bug.cgi?id=248119
        const movementX = event.x - this.#lastX;
        const movementY = event.y - this.#lastY;
        this.#lastX = event.x;
        this.#lastY = event.y;
        this.#deltaX = movementY * 0.15 * this.factor;
        this.rotationXTarget.rotation.x = clamp(this.rotationXTarget.rotation.x + this.#deltaX, this.minFlingRotationX, this.maxFlingRotationX);
        this.#deltaY = -movementX * 0.15 * this.factor;
        this.rotationYTarget.rotation.y = clamp(this.rotationYTarget.rotation.y + this.#deltaY, this.minFlingRotationY, this.maxFlingRotationY);
    };
    #onPointerUp = (event) => {
        event.preventDefault();
        this.#pointerCount--;
        if (this.#pointerCount === 0) {
            if (this.interactionContainer.hasPointerCapture(this.#mainPointer))
                this.interactionContainer.releasePointerCapture(this.#mainPointer);
            this.#mainPointer = -1;
            // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
            this.interactionContainer.removeEventListener('pointerup', this.#onPointerUp);
        }
        // stop dragging
        // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
        this.interactionContainer.removeEventListener('pointermove', this.#onMove);
        if (this.#deltaX === 0 && this.#deltaY === 0)
            return;
        // slow the rotation down based on former drag speed
        this.rotationXTarget.rotation = (x, y, z) => {
            this.#deltaX = this.#deltaX * 0.95;
            // stop rotation once the delta is small enough that we
            // no longer notice the rotation.
            if (Math.abs(this.#deltaX) < 0.01)
                return false;
            return [clamp(x + this.#deltaX, this.minFlingRotationX, this.maxFlingRotationX), y, z];
        };
        this.rotationYTarget.rotation = (x, y, z) => {
            this.#deltaY = this.#deltaY * 0.95;
            // stop rotation once the delta is small enough that we
            // no longer notice the rotation.
            if (Math.abs(this.#deltaY) < 0.01)
                return false;
            return [x, clamp(y + this.#deltaY, this.minFlingRotationY, this.maxFlingRotationY), z];
        };
    };
    #onDragStart = (event) => event.preventDefault();
    #isStarted = false;
    start() {
        if (this.#isStarted)
            return this;
        this.#isStarted = true;
        this.#aborter = new AbortController();
        // @ts-expect-error, whyyyy TypeScript TODO fix TypeScript lib.dom types.
        this.interactionInitiator.addEventListener('pointerdown', this.#onPointerDown, { signal: this.#aborter.signal });
        // Hack needed for Chrome (works fine in Firefox) otherwise
        // pointercancel breaks the drag handling. See
        // https://crbug.com/1166044
        // @ts-expect-error, whyyyy TypeScript It says that event type is Event instead of PointerEvent
        this.interactionInitiator.addEventListener('dragstart', this.#onDragStart, { signal: this.#aborter.signal });
        this.interactionInitiator.addEventListener('pointercancel', event => {
            event.preventDefault();
            console.error('Pointercancel should not be happening. If so, please kindly open an issue at https://github.com/lume/lume/issues.');
        }, { signal: this.#aborter.signal });
        return this;
    }
    stop() {
        if (!this.#isStarted)
            return this;
        this.#isStarted = false;
        this.#mainPointer = -1;
        this.#pointerCount = 0;
        // Stop any current animation.
        this.rotationXTarget.rotation = () => false;
        this.rotationYTarget.rotation = () => false;
        this.#aborter.abort();
        return this;
    }
}
//# sourceMappingURL=FlingRotation.js.map
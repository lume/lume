import type { SharedAPI } from './SharedAPI.js';
export type RenderTask = (timestamp: number, deltaTime: number) => false | void;
declare class _Motor {
    #private;
    /**
     * When a render tasks is added a new requestAnimationFrame loop will be
     * started if there isn't one currently.
     *
     * A render task is simply a function that will be called over and over
     * again, in the Motor's animation loop. That's all, nothing special.
     * However, if a Element3D setter is used inside of a render task, then the Element3D
     * will tell Motor that it needs to be re-rendered, which will happen at
     * the end of the current frame. If a Element3D setter is used outside of a
     * render task (i.e. outside of the Motor's animation loop), then the Element3D
     * tells Motor to re-render the Element3D on the next animation loop tick.
     * Basically, regardless of where the Element3D's setters are used (inside or
     * outside of the Motor's animation loop), rendering always happens inside
     * the loop.
     *
     * @param {Function} fn The render task to add.
     *
     * @return {Function} A reference to the render task. Useful for saving to
     * a variable so that it can later be passed to Motor.removeRenderTask().
     */
    addRenderTask(fn: RenderTask): RenderTask;
    removeRenderTask(fn: RenderTask): void;
    /**
     * Adds a render task that executes only once instead of repeatedly. Set
     * `allowDuplicates` to `false` to skip queueing a function if it is already
     * queued.
     */
    once(fn: RenderTask, allowDuplicates?: boolean): RenderTask | undefined;
    needsUpdate(element: SharedAPI): void;
    /**
     * Set the function that is used for requesting animation frames. The
     * default is `globalThis.requestAnimationFrame`. A Scene with WebXR enabled
     * will pass in the XRSession's requester that controls animation frames for
     * the XR headset.
     */
    setFrameRequester(requester: (fn: FrameRequestCallback) => number): void;
}
export declare const Motor: _Motor;
export {};
//# sourceMappingURL=Motor.d.ts.map
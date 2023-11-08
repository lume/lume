import type { SharedAPI } from './SharedAPI.js';
export type RenderTask = (timestamp: number, deltaTime: number) => false | void;
declare class _Motor {
    #private;
    addRenderTask(fn: RenderTask): RenderTask;
    removeRenderTask(fn: RenderTask): void;
    once(fn: RenderTask, allowDuplicates?: boolean): RenderTask | undefined;
    needsUpdate(element: SharedAPI): void;
    setFrameRequester(requester: (fn: FrameRequestCallback) => number): void;
}
export declare const Motor: _Motor;
export {};
//# sourceMappingURL=Motor.d.ts.map
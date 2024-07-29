import type { Constructor } from 'lowclass';
import type { ModelType, ThreeModel } from '../models/Model.js';
export declare class EventTypes {
    /**
     * This event is fired when a *-model element, or a node element with a
     * *-model behavior, has loaded it's model.
     * @deprecated Use DOM `load` event instead, f.e. `element.addEventListener('load', instead)`
     */
    MODEL_LOAD: {
        format: ModelType;
        model: ThreeModel;
    };
    /**
     * @deprecated
     * Fired if a *-model element, or node element with *-model behavior,
     * has an error during load.
     */
    MODEL_ERROR: Error;
    /**
     * @deprecated
     * Fired by elements that load resources. See
     * https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent
     */
    PROGRESS: ProgressEvent;
    constructor(
    /**
     * This event is fired when a *-model element, or a node element with a
     * *-model behavior, has loaded it's model.
     * @deprecated Use DOM `load` event instead, f.e. `element.addEventListener('load', instead)`
     */
    MODEL_LOAD: {
        format: ModelType;
        model: ThreeModel;
    }, 
    /**
     * @deprecated
     * Fired if a *-model element, or node element with *-model behavior,
     * has an error during load.
     */
    MODEL_ERROR: Error, 
    /**
     * @deprecated
     * Fired by elements that load resources. See
     * https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent
     */
    PROGRESS: ProgressEvent);
}
export declare const Events: Readonly<{
    MODEL_LOAD: "MODEL_LOAD";
    MODEL_ERROR: "MODEL_ERROR";
    PROGRESS: "PROGRESS";
}>;
export declare function makeEnumFromClassProperties<T>(Class: Constructor<T>): Readonly<{ [k in keyof T]: k; }>;
//# sourceMappingURL=Events.d.ts.map
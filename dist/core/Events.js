export class EventTypes {
    MODEL_LOAD;
    MODEL_ERROR;
    PROGRESS;
    constructor(
    // This event is fired when a *-model element, or a node element with a
    // *-model behavior, has loaded it's model.
    MODEL_LOAD, 
    // Fired if a *-model element, or node element with *-model behavior,
    // has an error during load.
    MODEL_ERROR, 
    // Fired by elements that load resources. See
    // https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent
    PROGRESS) {
        this.MODEL_LOAD = MODEL_LOAD;
        this.MODEL_ERROR = MODEL_ERROR;
        this.PROGRESS = PROGRESS;
    }
}
export const Events = makeEnumFromClassProperties(EventTypes);
// loop on the keys of a dummy class instance in order to create an enum-like
// object.
export function makeEnumFromClassProperties(Class) {
    const Enum = {};
    for (const key in new Class()) {
        Enum[key] = key;
    }
    return Object.freeze(Enum);
}
//# sourceMappingURL=Events.js.map
export class EventTypes {
    GL_LOAD;
    GL_UNLOAD;
    CSS_LOAD;
    CSS_UNLOAD;
    BEHAVIOR_GL_LOAD;
    BEHAVIOR_GL_UNLOAD;
    MODEL_LOAD;
    MODEL_ERROR;
    PROGRESS;
    constructor(GL_LOAD, GL_UNLOAD, CSS_LOAD, CSS_UNLOAD, BEHAVIOR_GL_LOAD, BEHAVIOR_GL_UNLOAD, MODEL_LOAD, MODEL_ERROR, PROGRESS) {
        this.GL_LOAD = GL_LOAD;
        this.GL_UNLOAD = GL_UNLOAD;
        this.CSS_LOAD = CSS_LOAD;
        this.CSS_UNLOAD = CSS_UNLOAD;
        this.BEHAVIOR_GL_LOAD = BEHAVIOR_GL_LOAD;
        this.BEHAVIOR_GL_UNLOAD = BEHAVIOR_GL_UNLOAD;
        this.MODEL_LOAD = MODEL_LOAD;
        this.MODEL_ERROR = MODEL_ERROR;
        this.PROGRESS = PROGRESS;
    }
}
export const Events = makeEnumFromClassProperties(EventTypes);
export function makeEnumFromClassProperties(Class) {
    const Enum = {};
    for (const key in new Class()) {
        Enum[key] = key;
    }
    return Object.freeze(Enum);
}
//# sourceMappingURL=Events.js.map
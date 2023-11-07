import { attribute as _attribute, stringAttribute as _stringAttribute, numberAttribute as _numberAttribute, booleanAttribute as _booleanAttribute, } from '@lume/element';
import { decoratorAbstraction, receiver } from './PropReceiver.js';
export { reactive } from '@lume/element';
export function attribute(handlerOrProtoOrArg, propName, descriptor) {
    let originalDeco = _attribute;
    if (arguments.length === 1) {
        originalDeco = _attribute(handlerOrProtoOrArg);
        return (prototype, propName, descriptor) => {
            return decoratorAbstraction(decorator, prototype, propName, descriptor);
        };
    }
    else {
        originalDeco = _attribute;
        return decoratorAbstraction(decorator, handlerOrProtoOrArg, propName, descriptor);
    }
    function decorator(prototype, propName, descriptor) {
        descriptor = originalDeco(prototype, propName, descriptor);
        descriptor = receiver(prototype, propName, descriptor);
        return descriptor;
    }
}
attribute.string = _attribute.string;
attribute.number = _attribute.number;
attribute.boolean = _attribute.boolean;
export function stringAttribute(defaultValue = '') {
    return attribute(attribute.string(defaultValue));
}
export function numberAttribute(defaultValue = 0) {
    return attribute(attribute.number(defaultValue));
}
export function booleanAttribute(defaultValue = false) {
    return attribute(attribute.boolean(defaultValue));
}
//# sourceMappingURL=attribute.js.map
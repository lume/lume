import { observe, unobserve } from 'james-bond';
const isPropReceiverClass = Symbol();
export function PropReceiver(Base = Object) {
    class PropReceiver extends Base {
        constructor(...args) {
            super(...args);
            this._propChangedCallback = this._propChangedCallback.bind(this);
        }
        connectedCallback() {
            super.connectedCallback && super.connectedCallback();
            this.__forwardInitialProps();
            this.#observeProps();
        }
        disconnectedCallback() {
            super.disconnectedCallback && super.disconnectedCallback();
            this.#unobserveProps();
        }
        get observedObject() {
            throw new TypeError(`
                The subclass using PropReceiver must define
                'observedObject' to specify the object from which props
                are received.
            `);
        }
        _propChangedCallback(propName, value) {
            ;
            this[propName] = value;
        }
        #observeProps() {
            observe(this.observedObject, this.__forwardedProps(), this._propChangedCallback, {});
        }
        #unobserveProps() {
            unobserve(this.observedObject, this.__forwardedProps(), this._propChangedCallback);
        }
        static receivedProperties;
        __forwardedProps() {
            const ctor = this.constructor;
            const props = (ctor.receivedProperties || []);
            if (!Array.isArray(props))
                throw new TypeError('Expected protected static receivedProperties to be an array.');
            return props;
        }
        __forwardInitialProps() {
            const observed = this.observedObject;
            for (const prop of this.__forwardedProps()) {
                prop in observed && this._propChangedCallback(prop, observed[prop]);
            }
        }
    }
    ;
    PropReceiver[isPropReceiverClass] = true;
    return PropReceiver;
}
export function receiver(...args) {
    return decoratorAbstraction(decorator, ...args);
    function decorator(prototype, propName, _descriptor) {
        const ctor = prototype?.constructor;
        if (!(ctor && ctor[isPropReceiverClass]))
            throw new TypeError('@receiver must be used on a property of a class that extends PropReceiver');
        if (!ctor.hasOwnProperty('receivedProperties'))
            ctor.receivedProperties = [...(ctor.receivedProperties || [])];
        ctor.receivedProperties.push(propName);
    }
}
export function decoratorAbstraction(decorator, handlerOrProtoOrFactoryArg, propName, descriptor) {
    const isDecoratorV2 = handlerOrProtoOrFactoryArg && 'kind' in handlerOrProtoOrFactoryArg;
    if (isDecoratorV2) {
        const classElement = handlerOrProtoOrFactoryArg;
        return {
            ...classElement,
            finisher(Class) {
                decorator(Class.prototype, classElement.key);
                return classElement.finisher?.(Class) ?? Class;
            },
        };
    }
    if (handlerOrProtoOrFactoryArg && propName) {
        const prototype = handlerOrProtoOrFactoryArg;
        return decorator(prototype, propName, descriptor);
    }
    throw new TypeError('Invalid decorator');
}
//# sourceMappingURL=PropReceiver.js.map
import Class from 'lowclass'
import Mixin from 'lowclass/Mixin'

const Brand = {}

// TODO TS does it need to be `T extends Constructor<{}>` instead of `T extends typeof Object`?
// const ObservableMixin = <T extends typeof Object>(Base: T) => {
const ObservableMixin = <T extends Constructor<{}>>(Base: T) => {
    return Class('Observable').extends(
        // (Base as unknown) as typeof Placeholder,
        (Base as unknown) as typeof Object,
        ({Private}) => ({
            constructor() {},

            on(eventName: string, callback: Function, context: any) {
                let __eventMap = this.__eventMap

                if (!__eventMap) __eventMap = this.__eventMap = new Map()

                let callbacks = __eventMap.get(eventName)

                if (!callbacks) __eventMap.set(eventName, (callbacks = []))

                if (typeof callback == 'function') callbacks.push([callback, context])
                // save callback associated with context
                else throw new Error('Expected a function in callback argument of Observable#on.')
            },

            off(eventName: string, callback: Function) {
                const __eventMap = this.__eventMap

                if (!__eventMap) return

                const callbacks = __eventMap.get(eventName)

                if (!callbacks) return

                const index = callbacks.findIndex(tuple => tuple[0] === callback)

                if (index == -1) return

                callbacks.splice(index, 1)

                if (callbacks.length === 0) __eventMap.delete(eventName)

                if (__eventMap.size === 0) this.__eventMap = null
            },

            emit(eventName: string, data: any) {
                const __eventMap = this.__eventMap

                if (!__eventMap) return

                const callbacks = __eventMap.get(eventName)

                if (!callbacks) return

                let tuple: typeof callbacks[0]
                let callback: typeof callbacks[0][0]
                let context: typeof callbacks[0][1]

                for (let i = 0, len = callbacks.length; i < len; i += 1) {
                    tuple = callbacks[i]
                    callback = tuple[0]
                    context = tuple[1]
                    callback.call(context, data)
                }
            },

            // alias for emit
            trigger(eventName: string, data: any) {
                return this.emit(eventName, data)
            },

            // alias for emit
            triggerEvent(eventName: string, data: any) {
                return this.emit(eventName, data)
            },

            protected: {Observable: 'Observable'},

            private: {
                __eventMap: null as null | Map<string, Array<[Function, any]>>,
            },
        }),
        Brand
    )
}

// TODO TS How to fix Mixin?
export default Mixin(ObservableMixin)

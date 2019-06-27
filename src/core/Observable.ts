import {Mixin} from 'lowclass'

// XXX Could it need to be `T extends Constructor<{}>` instead of `T extends typeof Object`?
// const ObservableMixin = <T extends typeof Object>(Base: T) => {
function ObservableMixin<T extends Constructor>(Base: T) {
    return class Observable extends Base {
        on(eventName: string, callback: Function, context: any) {
            let eventMap = this.__eventMap

            if (!eventMap) eventMap = this.__eventMap = new Map()

            let callbacks = eventMap.get(eventName)

            if (!callbacks) eventMap.set(eventName, (callbacks = []))

            if (typeof callback == 'function') callbacks.push([callback, context])
            // save callback associated with context
            else throw new Error('Expected a function in callback argument of Observable#on.')
        }

        off(eventName: string, callback: Function) {
            const eventMap = this.__eventMap

            if (!eventMap) return

            const callbacks = eventMap.get(eventName)

            if (!callbacks) return

            const index = callbacks.findIndex(tuple => tuple[0] === callback)

            if (index == -1) return

            callbacks.splice(index, 1)

            if (callbacks.length === 0) eventMap.delete(eventName)

            if (eventMap.size === 0) this.__eventMap = null
        }

        emit(eventName: string, data: any) {
            const eventMap = this.__eventMap

            if (!eventMap) return

            const callbacks = eventMap.get(eventName)

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
        }

        // alias for emit
        trigger(eventName: string, data: any) {
            return this.emit(eventName, data)
        }

        // alias for emit
        triggerEvent(eventName: string, data: any) {
            return this.emit(eventName, data)
        }

        private __eventMap: Map<string, Array<[Function, any]>> | null = null
    }
}

export const Observable = Mixin(ObservableMixin)
export default Observable

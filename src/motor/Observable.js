
const instanceofSymbol = Symbol('instanceofSymbol')

const ObservableMixin = base => {
    class Observable extends base {

        on(eventName, callback) {
            if (!this._eventMap)
                this._eventMap = new Map

            if (!this._eventMap.has(eventName))
                this._eventMap.set(eventName, [])

            this._eventMap.get(eventName).push(callback)
        }

        off(eventName, callback) {
            if (!this._eventMap || !this._eventMap.has(eventName)) return

            const callbacks = this._eventMap.get(eventName)

            if (callbacks.indexOf(callback) === -1) return

            callbacks.splice(callbacks.indexOf(callback), 1)

            if (callbacks.length === 0) this._eventMap.delete(eventName)

            if (this._eventMap.size === 0) this._eventMap = null
        }

        triggerEvent(eventName, data) {
            if (!this._eventMap || !this._eventMap.has(eventName)) return

            const callbacks = this._eventMap.get(eventName)

            for (let i=0, len=callbacks.length; i<len; i+=1) {
                callbacks[i](data)
            }
        }
    }

    Object.defineProperty(Observable, Symbol.hasInstance, {
        value: function(obj) {
            if (this !== Observable) return Object.getPrototypeOf(Observable)[Symbol.hasInstance].call(this, obj)

            let currentProto = obj

            while(currentProto) {
                let desc = Object.getOwnPropertyDescriptor(currentProto, "constructor")

                if (desc && desc.value && desc.value.hasOwnProperty(instanceofSymbol))
                    return true

                currentProto = Object.getPrototypeOf(currentProto)
            }

            return false
        }
    })

    Observable[instanceofSymbol] = true

    return Observable
}

const Observable = ObservableMixin(class{})
Observable.mixin = ObservableMixin

export {Observable as default}

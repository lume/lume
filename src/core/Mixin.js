import Class from 'lowclass'

export default
function Mixin( factory, Default ) {

    factory = Cached( factory )
    factory = HasInstance( factory )
    factory = Dedupe( factory )
    factory = WithDefault( factory, Default || Class() )
    factory = ApplyDefault( factory )

    return factory()
}

function WithDefault( classFactory, Default ) {
    return Base => {
        Base = Base || Default
        return classFactory( Base )
    }
}

function Cached( classFactory ) {
    const classCache = new WeakMap

    return Base => {
        let Class = classCache.get( Base )

        if ( !Class ) {
            classCache.set( Base, Class = classFactory( Base ) )
        }

        return Class
    }
}

function HasInstance( classFactory ) {
    const instanceofSymbol = Symbol('instanceofSymbol')

    return Base => {
        const Class = classFactory( Base )

        Class[instanceofSymbol] = true

        if ( typeof Symbol === 'undefined' || !Symbol.hasInstance ) return Class
        if ( Object.getOwnPropertySymbols( Class ).includes( Symbol.hasInstance ) ) return Class

        Object.defineProperty(Class, Symbol.hasInstance, {

            value: function(obj) {

                if (this !== Class)
                    return Object.getPrototypeOf(Class)[Symbol.hasInstance].call(this, obj)

                let currentProto = obj

                while(currentProto) {
                    const descriptor = Object.getOwnPropertyDescriptor(currentProto, "constructor")

                    if (
                        descriptor &&
                        descriptor.value &&
                        descriptor.value.hasOwnProperty(instanceofSymbol)
                    ) return true

                    currentProto = Object.getPrototypeOf(currentProto)
                }

                return false

            }

        })

        return Class
    }
}

// requires WithDefault or a classFactory that can accept no args
function ApplyDefault( classFactory ) {
    const DefaultClass = classFactory()
    DefaultClass.mixin = classFactory
    return classFactory
}

// requires ApplyDefault
function Dedupe( classFactory ) {
    const map = new WeakMap

    return Base => {

        if ( hasMixin( Base, classFactory, map ) )
            return Base

        const Class = classFactory( Base )
        map.set( Class, classFactory )
        return Class
    }
}

function hasMixin( Class, mixin, map ) {
    while (Class) {
        if ( map.get(Class) === mixin ) return true
        Class = Class.__proto__
    }

    return false
}

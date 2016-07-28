let propCacheSymbol = Symbol()

class MultiClassPrototype {
    constructor(propCache) {
        this[propCacheSymbol] = propCache
    }
}

// Just an idea: multiple inheritance...
// IMPORTANT NOTE: This assumes that the prototype of the classes are not
// modified after definition, otherwise the multi-inheritance won't work (not
// with this implementation at least, but could be possible to implement).
function multiple(...classes) {

    let constructorName = ''
    let multiClassPrototype = new MultiClassPrototype({classes})
    let multiClassPropsInitialized = false

    let protoPropsFlattenedForEachConstructor = [] // in same order as `classes`
    let allProps = []

    for (let [constructor, index] of classes) {

        constructorName += constructor.name + (index == classes.length-1 ? '' : '+')
        // f.e. SomeClass+OtherClass+FooBar

        let props = SimplePropertyRetriever.getOwnAndPrototypeEnumerablesAndNonenumerables(constructor.prototype)
        protoPropsFlattenedForEachConstructor.push(props)

        for (let prop of props) {
            if (!allProps.includes(prop))
                allProps.push(prop)
        }
    }

    // This constructor doesn't call super constructors, do that manually
    // with this.callSuperConstructor(Class, ...args).
    function MultiClass() {

        if (multiClassPropsInitialized) return

        for (let i=0, l=allProps.length; i<l; i+=1) {
            const prop = allProps[i]

            for (let i=0, l=classes.length; i<l; i+=1) {
                const ctorProps = protoPropsFlattenedForEachConstructor[i]
                const ctor = classes[i]

                if (ctorProps.includes(prop)) {

                    // check if the prop is a getter or setter. If so, we
                    // copy the getter to MultiClass.prototype. Basically
                    // we're just mixing the getters/setters onto the
                    // MultiClass.prototype the old mixin-way without
                    // prototype inheritance, which is not ideal, but seems
                    // to be the only option for now (I believe we can
                    // change this when we update to use Proxy).
                    let owner = ctor.prototype
                    while (!owner.hasOwnProperty(prop)) {
                        owner = Object.getPrototypeOf(owner)
                    }
                    let descriptor = Object.getOwnPropertyDescriptor(owner, prop)
                    if (typeof descriptor.set != 'undefined' || typeof descriptor.get != 'undefined') {
                        Object.defineProperty(multiClassPrototype, prop, descriptor)
                    }

                    // Otherwise, we make a new getter/setter.
                    else {
                        Object.defineProperty(multiClassPrototype, prop, {
                            get() {
                                let value = null

                                if (multiClassPrototype[propCacheSymbol].hasOwnProperty(prop)) {
                                    value = multiClassPrototype[propCacheSymbol][prop]
                                }
                                else {
                                    value = ctor.prototype[prop]
                                }

                                if (typeof value == 'function') {
                                    return value.bind(this)
                                }
                                return value
                            },
                            set(value) { multiClassPrototype[propCacheSymbol][prop] = value },
                        })
                    }

                    // break because we found the constructor with the
                    // property we're looking for (it has "highest
                    // precedence"), so we don't need to continue looking.
                    break
                }
            }

        }

        multiClassPropsInitialized = true
    }

    MultiClass.prototype = multiClassPrototype

    Object.assign(multiClassPrototype, {
        // we add this helper method because ES6 class constructors aren't manually callable.
        // f.e., We can't do `Foo.call(this, ...args)` in the subclass that extends
        // this multi-class, so we use this helper instead:
        // `this.callSuperConstructor(Foo, ...args)`.
        callSuperConstructor(nameOrRef, ...args) {
            let ctor = classes.find(ctor => ctor === nameOrRef || ctor.name == nameOrRef)
            if (!ctor) throw new Error('Unknown constructor specified to this.callSuperConstructor()')

            let obj = new ctor(...args)
            Object.assign(this, obj) // TODO: copy descriptors, as the constructor might possibly make those.
        }
    })

    return MultiClass
}

function isInstanceOf(obj, testClass) {
    if (obj instanceof testClass) return true

    console.log('--------------------------')
    console.log('checking for MultiClassPrototype')

    let proto = Object.getPrototypeOf(obj)

    // if obj contains the MultiClassPrototype in it's proto chain.
    if (obj instanceof MultiClassPrototype) {
        let {classes} = proto[propCacheSymbol]

        console.log(' If the test class is one in the multi-class cache')
        if (classes.includes(testClass)) {
            return true
        }

        console.log(' Otherwise loop and see if any classextends from testClass')
        for (let i=0, l=classes.length; i<l; i+=1) {
            let ctor = classes[i]
            if (ctor.prototype instanceof testClass) {
                return true
            }
        }
    }

    return false
}

// borrowed from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties
var SimplePropertyRetriever = {
    getOwnAndPrototypeEnumerablesAndNonenumerables: function (obj) {
        return this._getPropertyNames(obj, true, true, this._enumerableAndNotEnumerable);
    },
    // Private static property checker callbacks
    _enumerableAndNotEnumerable : function (obj, prop) {
        return true;
    },
    // Inspired by http://stackoverflow.com/a/8024294/271577
    _getPropertyNames : function getAllPropertyNames(obj, iterateSelfBool, iteratePrototypeBool, includePropCb) {
        var props = [];

        do {
            if (iterateSelfBool) {
                Object.getOwnPropertyNames(obj).forEach(function (prop) {
                    if (props.indexOf(prop) === -1 && includePropCb(obj, prop)) {
                        props.push(prop);
                    }
                });
            }
            if (!iteratePrototypeBool) {
                break;
            }
            iterateSelfBool = true;
        } while (obj = Object.getPrototypeOf(obj));

        return props;
    }
}

export { multiple as default }

class One {
    constructor(arg) {
        console.log('One constructor')
        this.one = arg
    }
    foo() {console.log('foo')}
}

class Two {
    constructor(arg) {
        console.log('Two constructor')
        this.two = arg
    }
    bar() {console.log('bar')}
}

class Three extends Two {
    constructor(arg1, arg2) {
        console.log('Three constructor')
        super(arg1)
        this.three = arg2
    }
    baz() {console.log('baz')}
}

class FooBar extends multiple(Three, One) {
    constructor(...args) {
        super() // needed, although does nothing.

        // call each constructor. We can pas specific args to each constructor if we like.
        //
        // XXX The following is not allowed with ES6 classes, class constructors are not callable. :[ How to solve?
        // One.call(this, ...args)
        // Three.call(this, ...args)
        //
        // XXX Solved with the callSuperConstructor helper.
        this.callSuperConstructor(One, args[0])
        this.callSuperConstructor(Three, args[1], args[2])
    }
    yeah() {console.log('yeah')}
}

let f = new FooBar(1,2,3)

// this shows that the modifications to `this` by each constructor worked:
console.log(f.one, f.two, f.three) // logs "1 2 3"

// all methods work:
f.foo()
f.bar()
f.baz()
f.yeah()

console.log('f instanceof MultiClassPrototype?', f instanceof MultiClassPrototype)

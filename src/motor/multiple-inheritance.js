import r from 'regexr'

function multiple(...classes) {

    // If more than one class extends from a native class, we may need to throw
    // an error, since we can't mix native prototypes; We won't throw if the
    // native prototypes of one class or in the same chain as the native
    // prototypes in the others. For example, if one class extends from Array
    // and another from Event, we'll throw an error because we can't put the
    // Array prototype before the Event prototype or vice versa
    // (`Array.prototype` and `Event.prototype` are `{enumerable:false,
    // writable:false, configurable:false}`, so we can't change the __proto__ of
    // those native prototypes, nor can we copy the native prototypes in order
    // to mix the copies). However, if one class extends (for example) the
    // AudioProcessingEvent (which extends Event) and another class extends
    // Event, then we don't need to throw an error because we can just re-use
    // the AudioProcessingEvent class prototype which already contains the Event
    // class prototype. Lastly and for example, if one class extends Array and
    // another extends AudioProcessingEvent as in the previous example, throw an
    // error because we can't mix the native prototypes.
    //
    // NOTE, if this check passes and if the classes being mixed are all
    // classes that don't extend any native classes, then the
    // commonLeafmostNativeProto will simply be Object.prototype.
    let commonLeafmostNativeProto = findCommonLeafmostPrototype(...classes)
    console.log('commonLeafmostNativeProto:', commonLeafmostNativeProto)
    if ( ! commonLeafmostNativeProto ) {
        throw new Error(`
            The provided classes cannot be mixed because they contain more than
            one native prototype chain, and it's simply not possible to mix
            them. For a more in-depth explanation, see: http://.....
        `)
    }

    // Duplicate each non-native prototype chain, attach them together, and
    // finally attach the chain to the commonLeafmostNativeProto (TODO in the
    // future we want to cache prototype chains and re-use them, instead of just
    // creating a new chain each time).
    //
    // TODO: Associate with each cloned prototype a clone of the constructor.
    // Use eval to make `super` work.
    //
    // TODO: Set @@hasInstance of the original classes so instanceof works.
    let currentClonedProto = null
    let lastClonedProto = null
    let composedProtoChain = null
    classes.forEach((currentClass, index) => {

        let currentProtoOfCurrentClass = currentClass.prototype

        // for each prototype of the currentClass
        while (true) {

            // If we've reached a native class, break the loop for the current
            // class so we can move to the next class and clone the next chain.
            //
            // This happens in the last iteration of the do..while loop, once
            // we've reached the first native prototype.
            if (isNativeMethod(currentProtoOfCurrentClass.constructor)) {

                // If we're on the last class and at the end of that class'
                // chain (on the first native prototype) then attach the
                // commonLeafmostNativeProto.
                if (index === classes.length-1 && lastClonedProto) {
                    Object.setPrototypeOf(lastClonedProto, commonLeafmostNativeProto)
                }

                break
            }
            else {
                // CONTINUE: find methods on currentProtoOfCurrentClass that use
                // `super`, get the string value, convert to object initiliazer
                // form, then eval. For example:

                currentClonedProto = cloneByDescriptor(currentProtoOfCurrentClass)
                console.log('current cloned proto:', currentClonedProto)

                // If we haven't saved the leafmost prototype of the composed
                // chain (i.e. the first prototype to be cloned), save it.
                if (!composedProtoChain) {
                    composedProtoChain = currentClonedProto
                    console.log('proto chain tail:', composedProtoChain)
                }

                if (lastClonedProto) {
                    Object.setPrototypeOf(lastClonedProto, currentClonedProto)
                }

                lastClonedProto = currentClonedProto
                currentProtoOfCurrentClass = Object.getPrototypeOf(currentProtoOfCurrentClass)
            }
        }

    })

    // return the composed class.
    console.log(' --- The final class!!', composedProtoChain.constructor)
    return composedProtoChain.constructor
}

// TODO: Also copy Symbol properties.
function cloneByDescriptor(objectToClone) {
    let newObj = null
    let methodsBody = ''

    const props = Object.getOwnPropertyNames(objectToClone)

    // copy the methods with proper `[[HomeObject]]`s
    for (let prop of props) {
        const descriptor = Object.getOwnPropertyDescriptor(objectToClone, prop)

        // If we have a function, append it's method-version to the methodsBody
        // for later when we use eval to set [[HomeObject]] of the methods
        // properly.
        //
        // TODO: handle multiple `super()` calls in `constructor()` methods. It
        // isn't likely, so skipping for now.
        //
        // TODO: handle super calls in getters/setters. It isn't likely, so
        // skipping for now. For now, those are copied in the next for loop
        // after we use eval in this loop.
        if (descriptor.value && typeof descriptor.value == 'function') {
            let methodString = descriptor.value.toString()

            // Remove "function <name>" from the method string to replace it
            // with "<prop>". F.e., if `prop === "bar"`, then `function blah() {}`
            // will be converted to `bar() {}`.
            //
            // TODO check the regex works.
            // const funcNameRegex= r`\s*function\s*(?:${r.identifier}\s*)?`
            // methodString = methodString.replace(funcNameRegex, prop)

            // If `prop` is "constructor", then replace `super(...)` with
            // `super.constructor(...)`. We need to do this so that we can wrap
            // the constructor in a new constructor that can be called with new
            // (because otherwise object initializer methods cannot be used with
            // `new`).
            if (prop == 'constructor') {
                const superRegex = r`super\s*\((.*?)\)`
                const match = superRegex.exec(methodString)
                if (match) {

                    // capture group 1 contains the arguments to the super() call.
                    const args = match[1]

                    methodString = methodString.replace(match[0], `super.constructor(${args})`)
                }
            }

            // methodsBody += `${methodString},\n`
            methodsBody += `${prop}: ${methodString},\n`
        }
    }

    // Here we use eval so that we can assign all the copied methods at once and
    // so that they will have the expected `[[HomeObject]]` so that super calls
    // work.
    eval(`
        newObj = {
            ${methodsBody}
        }
    `)

    // now copy the non-methods.
    for (let prop of props) {
        const descriptor = Object.getOwnPropertyDescriptor(objectToClone, prop)

        if (! (descriptor.value && typeof descriptor.value == 'function')) {
            Object.defineProperty(newObj, prop, descriptor)
        }
    }

    // Wrap the constructor in a new constructor that can be called with `new`
    // (because otherwise object initializer methods cannot be used with `new`).
    // let wrappedCtor = newObj.constructor
    // newObj.constructor = function() {
    //     console.log(' **** constructor wrapper **** ', wrappedCtor)
    //     wrappedCtor.call(this)
    // }

    newObj.constructor.prototype = newObj

    return newObj
}

/**
 * Checks if the supplied method is a native method belonging
 * to the JS environment. If you suspect Object.prototype.toString or
 * Function.prototype.toString has been overridden, supply a vanilla context
 * from which to use the native toString methods.
 *
 * Some code borrowed from
 * https://gist.github.com/jdalton/5e34d890105aca44399f#file-isnative-js-L50
 *
 * @param  {type} method The method to check.
 * @param  {type} context The context who's toString methods will be taken from.
 * If one isn't provided, defaults to the current global context (`window` in
 * browsers, `global` in Node.js), but it is highly recommended to supply one as
 * this also guards against methods that are created with `.bind()` which seem
 * to be native although they are not, and so providing a vanilla context
 * ensures that there are no bound methods in the context so that we don't get
 * faked out.
 * @returns {GlobalContext} Return a plain unmodified `window` object in
 * browsers, and a plain unmodified `global` object in Node.js.
 */
function isNativeMethod(method, context) {
    const ctx = context || getCurrentGlobalContext()

    // Used to resolve the internal `[[Class]]` of values.
    const toString = ctx.Object.prototype.toString

    // Used to resolve the decompiled source of functions.
    const fnToString = ctx.Function.prototype.toString

    // Used to detect host constructors (Safari > 4; really typed array specific).
    const reHostCtor = /^\[object .+?Constructor\]$/

    // Compile a regexp using a common native method as a template.
    // We chose `Object#toString` because there's a good chance it is not being mucked with.
    const reNative = ctx.RegExp('^' +

        // Coerce `Object#toString` to a string.
        ctx.String(toString)

            // Escape any special regexp characters.
            .replace(/[.*+?^${}()|[\]\/\\]/g, '\\$&')

            // Replace mentions of `toString` with `.*?` to keep the template generic.
            // Replace thing like `for ...` to support environments, like Rhino, which add extra
            // info such as method arity.
            .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    )

    const type = typeof method

    return type == 'function'

        // Use `Function#toString` to bypass the method's own `toString` method
        // and avoid being faked out.
        ? reNative.test(fnToString.call(method))

        // Fallback to a host object check because some environments will represent
        // things like typed arrays as DOM methods which may not conform to the
        // normal native pattern.
        : (method && type == 'object' && reHostCtor.test(toString.call(method))) || false
}

/**
 * getCurrentGlobalContext - Get the current global object.
 *
 * @returns {GlobalContext} The current global object (`window` in browsers, `global` in Node.js).
 */
function getCurrentGlobalContext() {
    let ctx = null

    // XXX is there a better check to perform?
    if (typeof window == 'object') ctx = window // browsers
    else if (typeof global == 'object') ctx = global // Node.js

    return ctx
}

function getVanillaContext() {
    let context = getCurrentGlobalContext()

    // in browser environments
    if (typeof window != 'undefined') {
        let iframe = document.createElement("iframe")
        iframe.height = 0
        iframe.width = 0
        document.body.appendChild(iframe)
        context = iframe.contentWindow
    }

    // in Node.js environments
    else if (typeof global != 'undefined') {
        // TODO ...
    }

    return context
}

function destroyVanillaContext(ctx) {

}

function findCommonLeafmostPrototype(...classes) {

    // cache for the following checks. If afterwords we have more than one
    // leafmost native prototype, it means we have a branch, and we cannot mix
    // the classes.
    const cache = new Set

    // get all the leafmost native classes, and if we have only one, then we're
    // good.
    classes.forEach((ctor, index) => {
        const tmpFunc = function() {}
        const currentLeafmostNativePrototype = getLeafmostNativePrototype(ctor)

        // Add the first native prototype to the cache by default.
        if (index == 0) cache.add(currentLeafmostNativePrototype)

        // if the any of the currently cached leafmost native prototypes contain the current
        // leafmost native prototype, we don't need to cache it.
        const protosToRemoveFromCache = new Set
        const protosToAddToCache = new Set
        for (let cachedProto of cache) {

            // break if already cached
            if (cachedProto === currentLeafmostNativePrototype) break

            // break if cachedProto already contains the current
            // currentLeafmostNativePrototype of the outter loop in its chain
            //
            // HACK: Use tmpFunc prototype to perform the following instanceof
            // check, since the right hand side of instanceof must be a function.
            tmpFunc.prototype = currentLeafmostNativePrototype
            if (cachedProto instanceof tmpFunc) break

            // Perform the reverse check, maybe the current proto contains the
            // cached proto
            //
            // similar HACK here as the previous one.
            tmpFunc.prototype = cachedProto
            if (currentLeafmostNativePrototype instanceof tmpFunc) {

                // mark the cachedProto for removal after the loop is done.
                protosToRemoveFromCache.add(cachedProto)

                // and mark the currentLeafmostNativePrototype for addition to
                // the cache because it contains the current cachedProto in its
                // chain.
                protosToAddToCache.add(currentLeafmostNativePrototype)
            }

            // Otherwise we have a new leafmost native prototype
            else {
                // mark the currentLeafmostNativePrototype for addition to the
                // cache because it doesn't contain the cachedProto, nor does
                // the cachedProto contain it.
                protosToAddToCache.add(currentLeafmostNativePrototype)

                // NOTE, we could possibly just return false here and terminate
                // the function, since we've satisfied the false requirement.
            }
        }

        for (let proto of protosToRemoveFromCache) cache.delete(proto)
        protosToRemoveFromCache.clear()

        for (let proto of protosToAddToCache) cache.add(proto)
        protosToAddToCache.clear()
    })

    // If we have more than one native prototype in the cache, it means we found
    // more than one leafmost native prototype, which means we cannot mix the
    // given classes as expected, so return false.
    if (cache.size != 1) return false

    // return the first and only value (if all the above went well)
    return cache.values().next().value
}

/**
 * Given a class constructor, traverses up the class' prototype chain to find
 * the first native prototype (one defined by the JS environment, not by JS
 * code).
 *
 * @param  {type} ctor The class constructor from which to begin the search.
 * @returns {Object} The leafmost prototype.
 */
function getLeafmostNativePrototype(ctor) {
    let result = null

    if (!ctor) return result

    let currentProto = ctor.prototype
    while (currentProto) {
        let currentCtor = currentProto.constructor

        if (isNativeMethod(currentCtor)) {
            result = currentProto
            break
        }

        currentProto = Object.getPrototypeOf(currentProto)
    }

    return result
}

export { multiple as default }

// TESTS ------------------------------------------------------------------

class One {
    constructor(options) {
        console.log('One constructor')
        console.log(super.constructor)
        this.one = options.one
    }
    foo() {console.log('foo')}
}

class Two {
    constructor(options) {
        console.log('Two constructor')
        console.log(super.constructor)
        this.two = options.two
    }
    bar() {console.log('bar')}
}

class Three extends Two {
    constructor(options) {
        super(options)
        console.log('Three constructor')
        console.log(super.constructor)
        this.three = options.three
    }
    baz() {console.log('baz')}
}

class FooBar extends multiple(Three, One) {
    constructor(options) {
        console.log('FooBar constructor')
        super(options)
        console.log(super.constructor)
    }
    yeah() {console.log('yeah')}
}

let f = new FooBar({
    one: 1,
    two: 2,
    three: 3,
})
console.log('f?', f)

// this shows that the modifications to `this` by each constructor worked:
console.log(f.one, f.two, f.three) // logs "1 2 3"

// all methods work:
f.foo()
f.bar()
f.baz()
f.yeah()

console.log(' --------------------------------- ran tests')

throw new Error('error')

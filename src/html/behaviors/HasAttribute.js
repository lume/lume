import 'custom-attributes/attr.js'

class BehaviorRegistry {
    constructor() {
        this._definedBehaviors = new Map
    }

    define( name, Behavior ) {
        if (! this._definedBehaviors.has( name )) {
            this._definedBehaviors.set( name, Behavior )
        }
        else {
            throw new Error( `Behavior ${ name } is already defined.` )
        }
    }

    get(name) {
        return this._definedBehaviors.get( name )
    }

    has( name ) {
        return this._definedBehaviors.has( name )
    }
}

window.elementBehaviors = new BehaviorRegistry

// for semantic purpose
class BehaviorMap extends Map {}

// stores the behaviors associated to each element.
const behaviorMaps = new WeakMap

// All elements have a `behaviors` property. If null, it the element has no
// behaviors, otherwise the property is a map of behavior names to behavior
// instances.
Object.defineProperty( Element.prototype, 'behaviors', {
    get() {
        let thisBehaviors = null;

        if ( ! behaviorMaps.has( this ) ) {
            behaviorMaps.set( this, thisBehaviors = new BehaviorMap )
        }
        else thisBehaviors = behaviorMaps.get( this )

        return thisBehaviors
    },
} )

// One instance of is instantiated per element with has="" attribute.
class HasAttribute {
    constructor() {
        // TODO constructor confusing because this.ownerElement doesn't exist. Report to custom-attributes

        this.observers = new Map
    }

    connectedCallback() {
        this.behaviors = this.ownerElement.behaviors
        this.changedCallback( '', this.value )
    }

    disconnectedCallback() {
        this.changedCallback( this.value, '' )
        delete this.behaviors
    }

    changedCallback( oldVal, newVal ) {
        const newBehaviors = this.getBehaviorNames( newVal )
        const previousBehaviors = Array.from( this.behaviors.keys() )

        // small optimization: if no previous or new behaviors, just quit
        // early. It would still function the same without this.
        if ( newBehaviors.length == 0 && previousBehaviors.length == 0 ) return

        const { removed, added } = this.getDiff( previousBehaviors, newBehaviors )
        this.handleDiff( removed, added )
    }

    getBehaviorNames( string ) {
        if ( string.trim() == '' ) return []
        else return string.split( /\s+/ )
    }

    getDiff( previousBehaviors, newBehaviors ) {
        const diff = {
            removed: [],
            added: newBehaviors,
        }

        for ( let i=0, l=previousBehaviors.length; i<l; i+=1 ) {
            const oldBehavior = previousBehaviors[ i ]

            // if it exists in the previousBehaviors but not the newBehaviors, then
            // the node was removed.
            if (! diff.added.includes( oldBehavior ) ) {
                diff.removed.push( oldBehavior )
            }

            // otherwise the old value also exists in the set of new values, so
            // therefore it wasn't added or removed, so let's remove it so we
            // don't count it as added
            else {
                diff.added.splice( diff.added.indexOf(oldBehavior), 1 )
            }
        }

        return diff
    }

    handleDiff( removed, added ) {

        for ( const name of removed ) {
            if ( ! elementBehaviors.has( name ) ) continue

            const behavior = this.behaviors.get( name )

            // TODO fire this disconnectedCallback only if the element is in a
            // document, not if it merely has a parent (the naive easy way for
            // now).
            if ( this.ownerElement.parentNode ) {
                behavior.disconnectedCallback( this.ownerElement )
            }

            // We can't rely on checking observedAttributes here because that
            // could change after the fact, we only ever check it when we add
            // the behavior. If it had observedAttributes, then it will have an
            // observer.
            if ( this.observers.has( behavior ) ) {
                this.destroyAttributeObserver( behavior )
            }

            this.behaviors.delete( name )
        }

        for ( const name of added ) {
            if ( ! elementBehaviors.has( name ) ) continue

            const Behavior = elementBehaviors.get( name )
            const behavior = new Behavior( this.ownerElement )
            this.behaviors.set( name, behavior )

            // TODO fire this connectedCallback only if the element is in a
            // document, not if it merely has a parent (the naive easy way for
            // now).
            if ( this.ownerElement.parentNode ) {
                behavior.connectedCallback( this.ownerElement )
            }

            if ( Array.isArray( behavior.constructor.observedAttributes ) ) {
                this.fireInitialAttributeChangedCallbacks( behavior )
                this.createAttributeObserver( behavior )
            }
        }
    }

    destroyAttributeObserver( behavior ) {
        this.observers.get( behavior ).disconnect()
        this.observers.delete( behavior )
    }

    // Behaviors observe attribute changes, implemented with MutationObserver
    //
    // We have to create one observer per behavior because otherwise
    // MutationObserver doesn't have an API for disconnecting from a single
    // element, only for disconnecting from all elements.
    createAttributeObserver( behavior ) {
        const observer = new MutationObserver( records => {

            for ( const record of records ) {
                behavior.attributeChangedCallback(
                    this.ownerElement,
                    record.attributeName,
                    record.oldValue,
                    this.ownerElement.getAttribute( record.attributeName )
                )
            }

        } )

        observer.observe( this.ownerElement, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: behavior.constructor.observedAttributes
        } )

        this.observers.set( behavior, observer )
    }

    fireInitialAttributeChangedCallbacks( behavior ) {
        if (! Array.isArray( behavior.constructor.observedAttributes ) ) return

        for ( const attr of Array.from( this.ownerElement.attributes ) ) {
            if ( ! behavior.constructor.observedAttributes.includes( attr.name ) ) continue
            if ( behavior.attributeChangedCallback )
                behavior.attributeChangedCallback( this.ownerElement, attr.name, undefined, attr.value )
        }
    }
}

customAttributes.define( 'has', HasAttribute )

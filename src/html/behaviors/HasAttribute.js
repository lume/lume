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

// One instance of is instantiated per element with has="" attribute.
class HasAttribute {
    constructor() {
        // this is confusing because this.ownerElement doesn't exist.
        //this.ownerElement.behaviors = new Map()
    }

    connectedCallback() {
        this.ownerElement.behaviors = new Map()
        this.changedCallback( '', this.value )
    }

    disconnectedCallback() {
        this.changedCallback( this.value, '' )
        delete this.ownerElement.behaviors
    }

    changedCallback( oldVal, newVal ) {
        const newBehaviors = newVal.split( /\s+/ )
        const previousBehaviors = Array.from(this.ownerElement.behaviors.keys())
        const { removed, added } = this.getDiff( previousBehaviors, newBehaviors )
        this.handleDiff( removed, added )
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

            const behavior = this.ownerElement.behaviors.get( name )

            // TODO fire this disconnectedCallback only if the element is in a
            // document, not if it merely has a parent (the naive easy way for
            // now).
            if ( this.ownerElement.parentNode ) {
                behavior.disconnectedCallback( this.ownerElement )
            }

            this.ownerElement.behaviors.delete( name )
        }

        for ( const name of added ) {
            if ( ! elementBehaviors.has( name ) ) continue

            const Behavior = elementBehaviors.get( name )
            const behavior = new Behavior( this.ownerElement )
            this.ownerElement.behaviors.set( name, behavior )

            // TODO fire this connectedCallback only if the element is in a
            // document, not if it merely has a parent (the naive easy way for
            // now).
            if ( this.ownerElement.parentNode ) {
                behavior.connectedCallback( this.ownerElement )
            }

            if ( Array.isArray( behavior.constructor.observedAttributes ) ) {

                this.fireInitialAttributeChangedCallbacks( behavior )

                console.log(' $$$$$$ creating attribute observer', name, behavior.constructor.observedAttributes, this.ownerElement.constructor.name)

                // used for observing attributes of elements that have behaviors, so we can
                // trigger attributeChangedCallbacks of the behaviors.
                const observer = new MutationObserver( records => {
                    console.log( ' %%%%%%% attribute change records', records )

                    // TODO: why does this MO callback fire twice for a single
                    // attribute change?????
                    for (const record of records) {
                        behavior.attributeChangedCallback(
                            this.ownerElement,
                            record.attributeName,
                            record.oldValue,
                            this.ownerElement.getAttribute(record.attributeName)
                        )
                    }
                } )

                observer.observe( this.ownerElement, {
                    attributes: true,
                    attributeOldValue: true,
                    attributeFilter: behavior.constructor.observedAttributes
                } )

            }
        }
    }

    fireInitialAttributeChangedCallbacks( behavior ) {
        if (! Array.isArray( behavior.observedAttributes ) ) return

        for ( const attr of Array.from( this.ownerElement.attributes ) ) {
            if ( ! behavior.observedAttributes.includes( attr.name ) ) continue
            if ( behavior.attributeChangedCallback )
                behavior.attributeChangedCallback( this.ownerElement, attr.name, undefined, attr.value )
        }
    }
}

customAttributes.define( 'has', HasAttribute )

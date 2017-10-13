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
// TODO split by \s white space, not " ".
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
        console.log( ' ^^^^^^ disconnected HasAttribute' )
        this.changedCallback( this.value, '' )
        delete this.ownerElement.behaviors
    }

    changedCallback( oldVal, newVal ) {
        console.log( ' ^^^^^^ changed HasAttribute', ' - old: ', oldVal, ' - new: ', newVal )
        const newBehaviors = newVal.split( ' ' )
        const previousBehaviors = this.ownerElement.behaviors.keys()
        const { removed, added } = this.getDiff( previousBehaviors, newBehaviors )
        this.handleDiff( removed, added )
    }

    getDiff( previousBehaviors, newBehaviors ) {
        const diff = {
            removed: [],
        }

        for ( let i=0, l=previousBehaviors.length; i<l; i+=1 ) {
            const oldBehavior = previousBehaviors[ i ]

            // if it exists in the previousBehaviors but not the newBehaviors, then
            // the node was removed.
            if (! newBehaviors.includes( oldBehavior ) ) {
                diff.removed.push( oldBehavior )
            }

            // otherwise the node wasn't added or removed.
            else {
                newBehaviors.splice( i, 1 )
            }
        }

        // The remaining nodes in newBehaviors must have been added.
        diff.added = newBehaviors

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

                console.log(' $$$$$$ creating attribute observer', behavior.constructor.observedAttributes, name, this.ownerElement.constructor.name)

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

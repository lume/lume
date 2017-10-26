
export default
function DefaultBehaviorsMixin(ElementClass) {

    // TODO This is here for now. Make it an extension to
    // element-behaviors so that it can be applied to any element
    // generically.
    return class DefaultBehaviors extends ElementClass {

        // override in subclasses
        static get defaultBehaviors() {
            return []
        }

        construct(...args) {
            if (super.construct) super.construct(...args)

            // If no geometry or material behavior is detected, add default ones.
            //
            // Deferring to a microtask doesn't work here, we must defer to a
            // macrotask with setTimeout, so we can detect if the element has
            // initial behaviors, otherwise the element's initial attributes
            // haven't been added yet (this is how HTML engines work, see
            // https://github.com/whatwg/dom/issues/522).
            //
            // TODO: If we use setTimeout (macrotask) deferral anywhere (like we do
            // here), and maybe even with microtask deferral (f.e. Promise), maybe
            // we should have a single place that initiate this deferral so that
            // everything in the engine can hook into it. Otherwise if different
            // call sites use setTimeout, logic will be firing at random and in
            // different order.
            setTimeout( () => this._setDefaultBehaviorsIfNeeded(), 0 )
        }

        _setDefaultBehaviorsIfNeeded() {
            const defaultBehaviorNames = this.constructor.defaultBehaviors

            // do nothing if there's no defaults
            if (defaultBehaviorNames.length == 0) return

            const initialBehaviorNames = Array.from( this.behaviors.keys() )

            // small optimization: if there are no initial behaviors and we
            // have default behaviors, just set the default behaviors.
            if ( initialBehaviorNames.length == 0 ) {
                this.setAttribute( 'has', this.getAttribute( 'has' ) + ` ${defaultBehaviorNames.join(' ')}`)
            }
            // otherwise detect which default behavior(s) to add
            else {

                let behaviorNamesToAdd = ''

                for (const defaultBehaviorName of this.constructor.defaultBehaviors) {

                    let hasBehavior = false

                    for ( const initialBehaviorName of initialBehaviorNames ) {
                        if ( defaultBehaviorName == initialBehaviorName ) {
                            hasBehavior = true
                            break
                        }
                    }

                    if (hasBehavior) continue
                    else {
                        // TODO programmatic API:
                        //this.behaviors.add('box-geometry')

                        // add a space in front of each name except the first
                        if ( behaviorNamesToAdd ) behaviorNamesToAdd += ' '

                        behaviorNamesToAdd += defaultBehaviorName
                    }
                }

                // add the needed behaviors all at once.
                if (behaviorNamesToAdd) {
                    let currentHasValue = this.getAttribute('has')

                    if (currentHasValue) currentHasValue + ' '

                    this.setAttribute( 'has', currentHasValue + behaviorNamesToAdd )
                }
            }

        }

    }
}

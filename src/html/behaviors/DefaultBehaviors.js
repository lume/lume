import Class from 'lowclass'
import Mixin from 'lowclass/Mixin'

const Brand = {}

export default Mixin(Base =>
    // TODO This is here for now. Make it an extension to
    // element-behaviors so that it can be applied to any element
    // generically.
    Class('DefaultBehaviors').extends(
        Base,
        ({Super, Public, Private}) => ({
            static: {
                // override in subclasses
                defaultBehaviors: [],
            },

            connectedCallback() {
                Super(this).connectedCallback && Super(this).connectedCallback()

                // If no geometry or material behavior is detected, add default ones.
                Private(this).__setDefaultBehaviorsIfNeeded()
            },

            private: {
                __setDefaultBehaviorsIfNeeded() {
                    const pub = Public(this)

                    let defaultBehaviors = pub.constructor.defaultBehaviors

                    // do nothing if there's no defaults
                    if (!defaultBehaviors) return
                    if (Object.keys(defaultBehaviors).length == 0) return

                    const hasAttribute = pub.getAttribute('has')
                    const initialBehaviorNames = (hasAttribute && hasAttribute.split(' ')) || []

                    // small optimization: if there are no initial behaviors and we
                    // have default behaviors, just set the default behaviors.
                    if (initialBehaviorNames.length === 0) {
                        // if not an array, then it's an object.
                        if (!(defaultBehaviors instanceof Array)) defaultBehaviors = Object.keys(defaultBehaviors)

                        pub.setAttribute('has', `${pub.getAttribute('has') || ''} ${defaultBehaviors.join(' ')}`)
                    }

                    // otherwise detect which default behavior(s) to add
                    else {
                        let behaviorNamesToAdd = ''

                        // if defaultBehaviors is an array, use default logic to add
                        // behaviors that aren't already added.
                        if (defaultBehaviors instanceof Array) {
                            for (const defaultBehaviorName of defaultBehaviors) {
                                let hasBehavior = false

                                for (const initialBehaviorName of initialBehaviorNames) {
                                    if (defaultBehaviorName == initialBehaviorName) {
                                        hasBehavior = true
                                        break
                                    }
                                }

                                if (hasBehavior) continue
                                else {
                                    // TODO programmatic API:
                                    //pub.behaviors.add('box-geometry')

                                    // add a space in front of each name except the first
                                    if (behaviorNamesToAdd) behaviorNamesToAdd += ' '

                                    behaviorNamesToAdd += defaultBehaviorName
                                }
                            }
                        }

                        // if defaultBehaviors is an object, then behaviors are added
                        // based on conditions.
                        else if (typeof defaultBehaviors == 'object') {
                            const defaultBehaviorNames = Object.keys(defaultBehaviors)

                            for (const defaultBehaviorName of defaultBehaviorNames) {
                                const condition = defaultBehaviors[defaultBehaviorName]

                                if (
                                    (typeof condition == 'function' && condition(initialBehaviorNames)) ||
                                    (typeof condition != 'function' && condition)
                                ) {
                                    // add a space in front of each name except the first
                                    if (behaviorNamesToAdd) behaviorNamesToAdd += ' '

                                    behaviorNamesToAdd += defaultBehaviorName
                                }
                            }
                        }

                        // add the needed behaviors all at once.
                        if (behaviorNamesToAdd) {
                            let currentHasValue = pub.getAttribute('has')

                            if (currentHasValue) currentHasValue += ' '

                            pub.setAttribute('has', currentHasValue + behaviorNamesToAdd)
                        }
                    }
                },
            },
        }),
        Brand
    )
)

import { Constructor } from 'lowclass';
export function DefaultBehaviors(Base) {
    return class DefaultBehaviors extends Constructor(Base) {
        static defaultBehaviors = [];
        connectedCallback() {
            super.connectedCallback && super.connectedCallback();
            this.#setDefaultBehaviorsIfNeeded();
        }
        #setDefaultBehaviorsIfNeeded() {
            let defaultBehaviors = this.constructor.defaultBehaviors;
            if (!defaultBehaviors)
                return;
            if (Object.keys(defaultBehaviors).length == 0)
                return;
            const hasAttribute = this.getAttribute('has');
            const initialBehaviorNames = (hasAttribute && hasAttribute.split(' ')) || [];
            if (initialBehaviorNames.length === 0) {
                if (!(defaultBehaviors instanceof Array))
                    defaultBehaviors = Object.keys(defaultBehaviors);
                this.setAttribute('has', `${this.getAttribute('has') || ''} ${defaultBehaviors.join(' ')}`);
            }
            else {
                let behaviorNamesToAdd = '';
                if (defaultBehaviors instanceof Array) {
                    for (const defaultBehaviorName of defaultBehaviors) {
                        let hasBehavior = false;
                        for (const initialBehaviorName of initialBehaviorNames) {
                            if (defaultBehaviorName == initialBehaviorName) {
                                hasBehavior = true;
                                break;
                            }
                        }
                        if (hasBehavior)
                            continue;
                        else {
                            if (behaviorNamesToAdd)
                                behaviorNamesToAdd += ' ';
                            behaviorNamesToAdd += defaultBehaviorName;
                        }
                    }
                }
                else if (typeof defaultBehaviors == 'object') {
                    const defaultBehaviorNames = Object.keys(defaultBehaviors);
                    for (const defaultBehaviorName of defaultBehaviorNames) {
                        const condition = defaultBehaviors[defaultBehaviorName];
                        if ((typeof condition == 'function' && condition(initialBehaviorNames)) ||
                            (typeof condition != 'function' && condition)) {
                            if (behaviorNamesToAdd)
                                behaviorNamesToAdd += ' ';
                            behaviorNamesToAdd += defaultBehaviorName;
                        }
                    }
                }
                if (behaviorNamesToAdd) {
                    let currentHasValue = this.getAttribute('has');
                    if (currentHasValue)
                        currentHasValue += ' ';
                    this.setAttribute('has', currentHasValue + behaviorNamesToAdd);
                }
            }
        }
    };
}
//# sourceMappingURL=DefaultBehaviors.js.map
import { Constructor } from 'lowclass/dist/Constructor.js';
import { r } from 'regexr';
// TODO Move this to element-behaviors package?
export function InitialBehaviors(Base) {
    return class InitialBehaviors extends Constructor(Base) {
        initialBehaviors;
        constructor(...args) {
            super(...args);
            queueMicrotask(() => this.#setBehaviors());
        }
        #setBehaviors() {
            if (!this.initialBehaviors)
                return;
            setBehaviors(this, this.initialBehaviors, false); // false -> don't replace if it already exists (the user set it)
        }
    };
}
function _setBehaviors(el, behaviors, replace) {
    let has = el.getAttribute('has') ?? '';
    const parts = has.split(' ');
    for (const [category, type] of Object.entries(behaviors)) {
        if (replace)
            el.setAttribute('has', (has = has.replace(r `/[a-z-]*-${category}/`, '') + ` ${type}-${category}`));
        else if (!parts.some(b => b.endsWith('-' + category)))
            el.setAttribute('has', (has = has + ` ${type}-${category}`));
    }
}
export function setBehaviors(el, behaviors, replace = true) {
    _setBehaviors(el, behaviors, replace);
}
//# sourceMappingURL=InitialBehaviors.js.map
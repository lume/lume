import * as elementClasses from './index.js';
import { autoDefineElements } from './LumeConfig.js';
let defined = false;
export function defineElements() {
    if (autoDefineElements || defined)
        return;
    defined = true;
    for (const key in elementClasses) {
        const PossibleElementClass = elementClasses[key];
        if (isLumeElementClass(PossibleElementClass))
            PossibleElementClass.defineElement();
    }
}
function isLumeElementClass(o) {
    if (typeof o?.defineElement === 'function' && o?.elementName)
        return true;
    return false;
}
/** @deprecated */
export const useDefaultNames = defineElements;
//# sourceMappingURL=defineElements.js.map
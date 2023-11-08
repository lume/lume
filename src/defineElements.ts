import * as elementClasses from './index.js'
import {autoDefineElements} from './LumeConfig.js'

import type {Element} from '@lume/element'

let defined = false

export function defineElements() {
	if (autoDefineElements || defined) return

	defined = true

	for (const key in elementClasses) {
		const PossibleElementClass = (elementClasses as Record<string, unknown>)[key]
		if (isLumeElementClass(PossibleElementClass)) PossibleElementClass.defineElement()
	}
}

function isLumeElementClass(o: any): o is typeof Element {
	if (typeof o?.defineElement === 'function' && o?.elementName) return true
	return false
}

/** @deprecated */
export const useDefaultNames = defineElements

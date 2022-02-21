import * as elementClasses from './index.js'
import {autoDefineElements} from './LumeConfig.js'

import type {Element} from '@lume/element'

let defined = false

export function defineElements() {
	if (autoDefineElements || defined) return

	defined = true

	for (const key in elementClasses) {
		const PossibleElementClass = (elementClasses as any)[key] as typeof Element | undefined
		if (PossibleElementClass?.elementName) PossibleElementClass.defineElement?.()
	}
}

/** @deprecated */
export const useDefaultNames = defineElements

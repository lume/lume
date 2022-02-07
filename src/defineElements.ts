import * as elementClasses from './index.js'

import type {Element} from '@lume/element'

let defined = false

export function defineElements() {
	if (defined) return
	defined = true

	for (const key in elementClasses) {
		const PossibleElementClass = (elementClasses as any)[key] as typeof Element | undefined
		// if (typeof PossibleElementClass !== 'function') continue
		if (PossibleElementClass?.elementName) PossibleElementClass.defineElement?.()
	}
}

export const useDefaultNames = defineElements

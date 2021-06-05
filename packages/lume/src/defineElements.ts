import * as elementClasses from './index.js'
import {useDefaultNames as _useDefaultNames} from './useDefaultNames.js'

import type {Element} from '@lume/element'

export function defineElements() {
	for (const key in elementClasses) {
		const ElementClass = (elementClasses as any)[key] as typeof Element | undefined
		if (ElementClass?.elementName) ElementClass?.defineElement?.()
	}
}

export function useDefaultNames() {
	// The old way
	_useDefaultNames()

	// The new way.
	defineElements()

	// TODO convert everything to the new way and delete useDefaultNames.
}

import * as elementClasses from './components/index.js'

// TODO? Remove element classes from the main bundle, make them separate.
import * as exampleElementClasses from './examples/index.js'

import type {Element} from '@lume/element'

export function defineElements() {
	const allClasses = {...elementClasses, ...exampleElementClasses}

	for (const key in allClasses) {
		const ElementClass = (allClasses as any)[key] as typeof Element | undefined
		if (ElementClass?.elementName) ElementClass?.defineElement?.()
	}
}

import {DOMPlane} from './DOMPlane.js'

// This class is an alias for DOMPlane/lume-dom-plane

/**
 * @deprecated Use DOMPlane (<lume-dom-plane>) instead.
 */
export class DOMNode extends DOMPlane {
	static defaultElementName = 'lume-dom-node'

	constructor() {
		super()
		console.warn('<lume-dom-node is deprecated. Use <lume-dom-plane> instead.')
	}
}

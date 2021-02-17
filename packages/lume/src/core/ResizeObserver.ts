// @ts-ignore
import RO from 'resize-observer-polyfill/dist/ResizeObserver.es.js'

import {getGlobal} from '../utils/getGlobal.js'

// TODO make sure this does not polyfill unless needed.
export function possiblyPolyfillResizeObserver() {
	if (typeof ResizeObserver !== 'undefined') return
	getGlobal().ResizeObserver = RO
}

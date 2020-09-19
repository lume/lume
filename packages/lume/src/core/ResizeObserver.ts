// @ts-ignore
import RO from 'resize-observer-polyfill/dist/ResizeObserver.es'

import {getGlobal} from '../utils/getGlobal'

export function possiblyPolyfillResizeObserver() {
	if (typeof ResizeObserver !== 'undefined') return
	getGlobal().ResizeObserver = RO
}

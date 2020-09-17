import {ResizeObserver, ResizeObserverEntry} from '@juggle/resize-observer'
import {getGlobal} from '../utils/getGlobal'

export async function possiblyPolyfillResizeObserver() {
	if (typeof ResizeObserver !== 'undefined') return

	{
		// @ts-ignore
		getGlobal().ResizeObserver = ResizeObserver
		// @ts-ignore
		getGlobal().ResizeObserverEntry = ResizeObserverEntry
	}
}

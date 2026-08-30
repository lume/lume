import {element, type ElementAttributes} from '@lume/element'
import {Node, type NodeAttributes} from '../core/Node.js'
import {autoDefineElements} from '../LumeConfig.js'

export type PushPaneLayoutAttributes = NodeAttributes

// !! WIP under construction

export
@element('lume-push-pane-layout', autoDefineElements)
class PushPaneLayout extends Node {
	// TODO
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-push-pane-layout': ElementAttributes<PushPaneLayout, PushPaneLayoutAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-push-pane-layout': PushPaneLayout
	}
}

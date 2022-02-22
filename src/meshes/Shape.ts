import {element} from '@lume/element'
import {Mesh} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {MeshAttributes} from './Mesh.js'

export type ShapeAttributes = MeshAttributes

/**
@element lume-shape
@class Shape - Allows creating a 2D shape that can be extruded.

<div id="example"></div>
<script>
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" :autorun="true" mode="html>iframe" />',
    data: { code: shapesExample },
  })
</script>
*/
@element('lume-shape', autoDefineElements)
export class Shape extends Mesh {
	static defaultBehaviors = {
		'shape-geometry': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-geometry'))
		},
		'phong-material': (initialBehaviors: any) => {
			return !initialBehaviors.some((b: any) => b.endsWith('-material'))
		},
	}
}

import type {ElementAttributes} from '@lume/element'
import type {ElementWithBehaviors, ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes} from '../index.js'

export interface Shape extends ElementWithBehaviors<ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes> {}

declare global {
	interface HTMLElementTagNameMap {
		'lume-shape': Shape
	}
}

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-shape': JSX.IntrinsicElements['lume-mesh'] &
				ElementAttributes<ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes>
		}
	}
}

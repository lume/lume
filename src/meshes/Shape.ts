import {element} from '@lume/element'
import {Mesh} from './Mesh.js'
import {autoDefineElements} from '../LumeConfig.js'

import type {MeshAttributes} from './Mesh.js'

export type ShapeAttributes = MeshAttributes

/**
@element lume-shape
@class Shape - Allows creating a 2D shape that can be extruded.

Default behaviors:

- [`shape-geometry`](../behaviors/geometries/ShapeGeometryBehavior.md)
- [`phong-material`](../behaviors/materials/PhongMaterialBehavior.md)

<div id="example"></div>
<script>
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" :autorun="true" mode="html>iframe" />',
    data: { code: shapesExample },
  })
</script>

Inherits attribute properties from [`ShapeGeometryBehavior`](../behaviors/geometries/ShapeGeometryBehavior.md).

@extends Mesh
*/
export {Shape}
@element('lume-shape', autoDefineElements)
class Shape extends Mesh {
	static override defaultBehaviors = {
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

// CONTINUE export was removed from this statement, but still kept on the above
// class. Does the type still work?
interface Shape extends ElementWithBehaviors<ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes> {}

declare global {
	interface HTMLElementTagNameMap {
		'lume-shape': Shape
	}
}

declare module 'solid-js' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-shape': JSX.IntrinsicElements['lume-mesh'] &
				ElementAttributes<ShapeGeometryBehavior, ShapeGeometryBehaviorAttributes>
		}
	}
}

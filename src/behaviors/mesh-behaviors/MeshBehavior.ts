import {RenderableBehavior} from '../RenderableBehavior.js'
import {Mesh} from '../../meshes/Mesh.js'
import {Points} from '../../meshes/Points.js'
import {InstancedMesh} from '../../meshes/InstancedMesh.js'
import type {StopFunction} from '@lume/element'

export type MeshComponentType = 'geometry' | 'material'

/**
 * @class MeshBehavior
 *
 * @extends RenderableBehavior
 */
export abstract class MeshBehavior extends RenderableBehavior {
	requiredElementType(): (typeof Mesh | typeof Points | typeof InstancedMesh)[] {
		// At the moment, a "mesh" behavior can be used on Mesh, Points, or anything that has a geometry and a material.
		// XXX An alternative to using arrays with multiple types is we could branch the class
		// hierarchy to avoid arrays/unions.
		return [Mesh, Points, InstancedMesh]
	}

	getMeshComponent<T>(name: 'geometry' | 'material'): T {
		return this.element.three[name] as unknown as T
	}

	// TODO WithAutoruns mixin or similar (decorators), instead of it being in a
	// base class. Not all sub-classes need it.
	_stopFns: StopFunction[] = []

	override unloadGL() {
		if (!super.unloadGL()) return false

		for (const stop of this._stopFns) stop()
		this._stopFns.length = 0

		return true
	}
}

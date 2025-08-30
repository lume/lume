import {Effectful} from 'classy-solid'
import {element} from '@lume/element'
import {Element3D} from '../core/Element3D.js'

/**
 * @class RenderableBehavior
 * Base class for element behaviors that provide rendering features (f.e. geometries, materials, etc).
 *
 * @extends HTMLElement
 */
// @ts-expect-error broken type checking in latest TypeScript (https://github.com/microsoft/TypeScript/issues/56330)
export abstract class RenderableBehavior extends Effectful(HTMLElement) {
	declare parentElement: Element3D | null

	connectedCallback() {
		this.parentElement?.needsUpdate()
	}

	disconnectedCallback() {
		this.parentElement?.needsUpdate()
	}
}
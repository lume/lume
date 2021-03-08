// Find a standalone version of this loading icon at
// https://codepen.io/trusktr/pen/poNxzqJ

import {Element, element, stringAttribute} from '@lume/element'
import {html} from '@lume/element/dist/html.js'
import {autoDefineElements} from '../LumeConfig.js'

const defaultColor = '120,130,140'

export type LoadingIconAttributes = 'color'

@element('loading-icon', autoDefineElements)
export class LoadingIcon extends Element {
	/** A string with an RGB triplet, comma separated. */
	@stringAttribute(defaultColor) color = defaultColor

	template = () => html`
		<>
			<div top></div>
			<div right></div>
			<div bottom></div>
			<div left></div>
		</>
	`

	css = /*css*/ `
		:host {
			--loading-icon-color: ${this.color};
		}

		[top], [right], [bottom], [left] {
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: 50%;
			opacity: 0;
			border: 8px solid rgba(var(--loading-icon-color), 0);
		}
		[top] {
			border-top-color: rgba(var(--loading-icon-color), 1);
			animation: fade 1s 0s infinite;
		}
		[right] {
			border-right-color: rgba(var(--loading-icon-color), 1);
			animation: fade 1s 0.25s infinite;
		}
		[bottom] {
			border-bottom-color: rgba(var(--loading-icon-color), 1);
			animation: fade 1s 0.5s infinite;
		}
		[left] {
			border-left-color: rgba(var(--loading-icon-color), 1);
			animation: fade 1s 0.75s infinite;
		}
		@keyframes fade {
			0% { opacity: 0; }
			50% { opacity: 1; }
			100% { opacity: 0; }
		}
	`
}

import type {ElementAttributes} from '@lume/element'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'loading-icon': ElementAttributes<LoadingIcon, LoadingIconAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'loading-icon': LoadingIcon
	}
}

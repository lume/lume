// This file extends attribute decorators from @lume/element so that they are
// composed with the @receiver decorator from PropReceiver.

import {
	attribute as _attribute,
	stringAttribute as _stringAttribute,
	numberAttribute as _numberAttribute,
	booleanAttribute as _booleanAttribute,
} from '@lume/element'
import {decoratorAbstraction, receiver} from './PropReceiver.js'
import type {AttributeHandler} from '@lume/element'

export {reactive, untrack} from '@lume/element'

export function attribute(prototype: any, propName: string, descriptor?: PropertyDescriptor): any
export function attribute(handler?: AttributeHandler): (proto: any, propName: string) => any
export function attribute(handlerOrProtoOrArg?: any, propName?: string, descriptor?: PropertyDescriptor): any {
	let originalDeco: any = _attribute

	if (arguments.length === 1) {
		originalDeco = _attribute(handlerOrProtoOrArg)

		return (prototype: any, propName: string, descriptor?: PropertyDescriptor) => {
			return decoratorAbstraction(decorator, prototype, propName, descriptor)
		}
	} else {
		originalDeco = _attribute

		return decoratorAbstraction(decorator, handlerOrProtoOrArg, propName, descriptor)
	}

	function decorator(prototype: any, propName: string, descriptor?: PropertyDescriptor) {
		descriptor = originalDeco(prototype, propName, descriptor)

		// Also apply the @receiver decorator so we don't have to do it manually
		// for all attribute props.
		descriptor = receiver(prototype, propName, descriptor)

		return descriptor
	}
}

attribute.string = _attribute.string
attribute.number = _attribute.number
attribute.boolean = _attribute.boolean

// The rest is copy/paste from lume/element

export function stringAttribute(defaultValue = '') {
	return attribute(attribute.string(defaultValue))
}

export function numberAttribute(defaultValue = 0) {
	return attribute(attribute.number(defaultValue))
}

export function booleanAttribute(defaultValue = false) {
	return attribute(attribute.boolean(defaultValue))
}

import {createMemo} from 'solid-js'
import {arraysEqual} from './arraysEqual.js'

export function createArrayMemo<T extends any>(fn: () => T[], initial: T[] = []) {
	return createMemo(fn, initial, {equals: arraysEqual})
}

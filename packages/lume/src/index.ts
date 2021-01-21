// TODO optimize concatenation in global build
// TODO consolidate duplicate Babel helpers
import {Class, Mixin} from 'lowclass'
export {Class, Mixin}
export * from '@lume/eventful'
export * from '@lume/element'
export * from '@lume/element/dist/html'

export * from './core'
export * from './html'
export * from './components'
export * from './layout'

import * as THREE from 'three/src/Three'
export {THREE}

export const version = '0.0.0-rc.0'

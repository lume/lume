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
export * from './interaction'

export * from './defineElements'

import * as _THREE from 'three/src/Three'

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

// Add more objects as needed.
export const THREE = {..._THREE, OrbitControls}

export const version = '0.0.0-rc.0'

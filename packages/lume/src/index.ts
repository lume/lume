// TODO optimize concatenation in global build
// TODO consolidate duplicate Babel helpers
import {Class, Mixin} from 'lowclass'
export {Class, Mixin}
export * from '@lume/eventful'
export * from '@lume/element'
export * from '@lume/element/dist/html.js'

export * from './core/index.js'
export * from './html/index.js'
export * from './components/index.js'
export * from './layout/index.js'
export * from './interaction/index.js'

export * from './defineElements.js'

import * as _THREE from 'three/src/Three.js'

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

// Add more objects as needed.
export const THREE = {..._THREE, OrbitControls}

export const version = '0.0.0'

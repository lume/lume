import './make-global'
import 'three/examples/js/loaders/MTLLoader'
import {getGlobal} from '../../utils/getGlobal'

const global = getGlobal() as any

// TODO get MTLLoader type from somewhere? Or make one.
export const MTLLoader = global.THREE.MTLLoader as any

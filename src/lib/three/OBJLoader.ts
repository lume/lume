import './make-global'
import 'three/examples/js/loaders/OBJLoader'
import {getGlobal} from '../../utils/getGlobal'

const global = getGlobal() as any

// TODO get OBJLoader type from somewhere? Or make one.
export const OBJLoader = global.THREE.OBJLoader as any

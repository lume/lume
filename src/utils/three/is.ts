import type {Mesh, Object3D} from 'three/src/Three'

export const isMesh = (o: Object3D): o is Mesh => 'isMesh' in o

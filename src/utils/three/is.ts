import type {Mesh, Object3D} from 'three/src/Three.js'
import type {RenderItem} from 'three/src/renderers/webgl/WebGLRenderLists.js'
import type {Camera} from 'three/src/cameras/Camera.js'
import type {OrthographicCamera} from 'three/src/cameras/OrthographicCamera.js'
import type {PerspectiveCamera} from 'three/src/cameras/PerspectiveCamera.js'

export const isMesh = (o: Object3D): o is Mesh => 'isMesh' in o

export function isRenderItem(obj: any): obj is RenderItem {
	return 'geometry' in obj && 'material' in obj
}

export function isPerspectiveCamera(camera: Camera): camera is PerspectiveCamera {
	return !!(camera as any).isPerspectiveCamera
}

export function isOrthographicCamera(camera: Camera): camera is OrthographicCamera {
	return !!(camera as any).isOrthographicCamera
}

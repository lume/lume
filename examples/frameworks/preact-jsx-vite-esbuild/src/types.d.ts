// TODO move these types into lume lib once we iron out the pattern for Preact JSX types.

import type {CameraRig, CameraRigAttributes, GltfModel, GltfModelAttributes, Scene, SceneAttributes} from 'lume'
import type {ReactElementAttributes} from '@lume/element/src/react'
import type {DashCasedProps} from '@lume/element'

import type {HTMLAttributes} from 'preact/compat'

type Attrs = 'src' | 'rotation' | 'position' | 'mountPoint' | 'size'

declare module 'preact' {
	namespace JSX {
		interface IntrinsicElements {
			// 'lume-gltf-model': ReactElementAttributes<GltfModel, GltfModelAttributes>

			'lume-gltf-model': Omit<HTMLAttributes<GltfModel>, GltfModelAttributes> &
				Partial<WithStringValues<Pick<GltfModel, GltfModelAttributes>>>
			// & DashCasedProps<Partial<StringOnlyValues<Pick<GltfModel, GltfModelAttributes>>>> // TODO pick only props with dashes for the attribute types.
		}
	}
}

declare module 'preact' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-scene': Omit<HTMLAttributes<Scene>, SceneAttributes> &
				Partial<WithStringValues<Pick<Scene, SceneAttributes>>>
		}
	}
}

declare module 'preact' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-camera-rig': Omit<HTMLAttributes<CameraRig>, CameraRigAttributes> &
				Partial<WithStringValues<Pick<CameraRig, CameraRigAttributes>>>
		}
	}
}

// import type {} from 'lume/src/index.react-jsx'

type WithStringValues<Type extends object> = {
	[Property in keyof Type]: NonNullable<Type[Property]> extends string ? Type[Property] : Type[Property] | string
}

// TODO pluck the exact string type of each key
type StringOnlyValues<Type extends object> = {
	[Property in keyof Type]: string
}

export {}

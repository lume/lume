import './FbxModel.js'
import {XYZNumberValues} from '../xyz-values/XYZNumberValues.js'
import {XYZValues} from '../xyz-values/XYZValues.js'

// JSX type tests
;<>
	{/* Transformable attributes */}
	{/* @ts-expect-error this error is good, a number is invalid */}
	<lume-fbx-model align-point={123} />
	{/* @ts-expect-error this is ok, but setter types are not seen by TS */}
	<lume-fbx-model align-point={[1, 2, 3]} />
	<lume-fbx-model align-point={'1 2 3'} />
	{/* @ts-expect-error this is ok, but setter types are not seen by TS */}
	<lume-fbx-model rotation={{x: 1, y: 2, z: 3}} />
	<lume-fbx-model rotation={{x: 1, y: 2, z: 3} as XYZNumberValues} />
	{/* @ts-expect-error this is ok, but setter types are not seen by TS */}
	<lume-fbx-model position={[1, 2, 3]} />
	<lume-fbx-model scale={'1 2 3'} />
	{/* @ts-expect-error this error is good, a boolean is invalid */}
	<lume-fbx-model scale />

	{/* Sizeable attributes */}
	<lume-fbx-model size={new XYZNumberValues(1, 2, 3)} />
	{/* @ts-expect-error does not accept XYZValues, but XYZNumberValues */}
	<lume-fbx-model size={new XYZValues(1, 2, 3)} />
	{/* @ts-expect-error this is ok, but setter types are not seen by TS */}
	<lume-fbx-model size-mode={['p', 'p']} />
	<lume-fbx-model size-mode={'p p'} />

	{/* Element3D attributes */}
	<lume-fbx-model visible={true} />
	<lume-fbx-model visible />
	{/* @ts-expect-error this error is good, a number is invalid */}
	<lume-fbx-model visible={123} />

	{/* FbxModel attributes */}
	{/* @ts-expect-error this error is good, a number is invalid */}
	<lume-fbx-model src={123} />
	<lume-fbx-model src={'foo.fbx'} />
</>

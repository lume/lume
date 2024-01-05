import './InstancedMesh.js';
import { XYZNumberValues } from '../xyz-values/XYZNumberValues.js';
import { XYZValues } from '../xyz-values/XYZValues.js';
<>
	{/* Transformable attributes */}
	{/* @ts-expect-error this error is good, a number is invalid */}
	<lume-instanced-mesh align-point={123}/>
	{/* @ts-expect-error this is ok, but setter types are not seen by TS */}
	<lume-instanced-mesh align-point={[1, 2, 3]}/>
	<lume-instanced-mesh align-point={'1 2 3'}/>
	{/* @ts-expect-error this is ok, but setter types are not seen by TS */}
	<lume-instanced-mesh rotation={{ x: 1, y: 2, z: 3 }}/>
	<lume-instanced-mesh rotation={{ x: 1, y: 2, z: 3 }}/>
	{/* @ts-expect-error this is ok, but setter types are not seen by TS */}
	<lume-instanced-mesh position={[1, 2, 3]}/>
	<lume-instanced-mesh scale={'1 2 3'}/>
	{/* @ts-expect-error this error is good, a boolean is invalid */}
	<lume-instanced-mesh scale/>

	{/* Sizeable attributes */}
	<lume-instanced-mesh size={new XYZNumberValues(1, 2, 3)}/>
	{/* @ts-expect-error does not accept XYZValues, but XYZNumberValues */}
	<lume-instanced-mesh size={new XYZValues(1, 2, 3)}/>
	{/* @ts-expect-error this is ok, but setter types are not seen by TS */}
	<lume-instanced-mesh size-mode={['p', 'p']}/>
	<lume-instanced-mesh size-mode={'p p'}/>

	{/* Element3D attributes */}
	<lume-instanced-mesh visible={true}/>
	<lume-instanced-mesh visible/>
	{/* @ts-expect-error this error is good, a number is invalid */}
	<lume-instanced-mesh visible={123}/>

	{/* Mesh attributes */}
	<lume-instanced-mesh cast-shadow/>
	{/* @ts-expect-error this error is good, a number is invalid */}
	<lume-instanced-mesh cast-shadow={123}/>
	<lume-instanced-mesh receive-shadow/>
	<lume-instanced-mesh receive-shadow={true}/>

	{/* material attributes */}
	<lume-instanced-mesh has="phong-material" shininess={0.3} reflectivity={0.4}/>
	{/* @ts-expect-error this error is good, a boolean is invalid */}
	<lume-instanced-mesh has="phong-material" shininess={true}/>
	{/* @ts-expect-error this error is good, a boolean is invalid */}
	<lume-instanced-mesh has="phong-material" reflectivity={false}/>
	<lume-instanced-mesh has="lambert-material" specular-map="./foo.jpg"/>
	{/* @ts-expect-error this error is good, a number is invalid */}
	<lume-instanced-mesh has="lambert-material" specular-map={123}/>

	{/* InstancedMesh attributes */}
	<lume-instanced-mesh count={123}/>
	{/* @ts-expect-error this error is good, a number is invalid */}
	<lume-instanced-mesh rotations={123}/>
	<lume-instanced-mesh rotations={[1, 2, 3]}/>
	<lume-instanced-mesh positions={[1, 2, 3]}/>
	<lume-instanced-mesh scales={[1, 2, 3]}/>
	<lume-instanced-mesh colors={[1, 2, 3]}/>
	{/* @ts-expect-error this error is good, a boolean is invalid */}
	<lume-instanced-mesh colors/>

	{/* @ts-expect-error this error is good, property does not exist */}
	<lume-instanced-mesh src={123}/>
</>;
//# sourceMappingURL=InstancedMesh.types.test.jsx.map
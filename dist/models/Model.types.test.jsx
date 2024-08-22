import './Model.js';
import './GltfModel.js';
<>
	<lume-gltf-model 
// event props type checked
onload={(event) => console.log(event)} onerror={(event) => console.log(event)} onprogress={(event) => console.log(event.loaded)}></lume-gltf-model>

	<lume-gltf-model 
// @ts-expect-error bad type
onload={(event) => console.log(event)} 
// @ts-expect-error bad type
onerror={(event) => console.log(event)} 
// @ts-expect-error bad type
onprogress={(event) => console.log(event)}></lume-gltf-model>
</>;
//# sourceMappingURL=Model.types.test.jsx.map
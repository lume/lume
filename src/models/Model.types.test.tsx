import './Model.js'
import './GltfModel.js'

// Solid JSX type tests
;<>
	<lume-gltf-model
		// event props
		onload={(event: Event) => console.log(event)}
		onerror={(event: Event) => console.log(event)}
		onprogress={(event: Event) => console.log(event)}
	></lume-gltf-model>
</>

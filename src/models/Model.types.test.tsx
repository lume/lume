import './Model.js'
import './GltfModel.js'

// Solid JSX type tests
;<>
	<lume-gltf-model
		// event props type checked
		onload={(event: Event) => console.log(event)}
		onerror={(event: Event) => console.log(event)}
		onprogress={(event: ProgressEvent) => console.log(event.loaded)}
	></lume-gltf-model>

	<lume-gltf-model
		// @ts-expect-error bad type
		onload={(event: MouseEvent) => console.log(event)}
		// @ts-expect-error bad type
		onerror={(event: MouseEvent) => console.log(event)}
		// @ts-expect-error bad type
		onprogress={(event: MouseEvent) => console.log(event)}
	></lume-gltf-model>
</>

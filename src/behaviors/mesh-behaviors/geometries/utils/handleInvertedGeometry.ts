import type {BufferGeometry} from 'three'

// Adapted from https://stackoverflow.com/questions/16824650. TODO This may not
// work for all cases, see: https://discourse.threejs.org/t/37171
export function handleInvertedGeometry(geometry: BufferGeometry) {
	let x = 0
	let y = 0
	let z = 0

	const normals = geometry.attributes.normal.array

	// flip normals
	for (let i = 0, l = normals.length / 9; i < l; i++) {
		// cache a coordinates
		x = normals[i * 9]
		y = normals[i * 9 + 1]
		z = normals[i * 9 + 2]

		// overwrite a with c
		normals[i * 9] = normals[i * 9 + 6]
		normals[i * 9 + 1] = normals[i * 9 + 7]
		normals[i * 9 + 2] = normals[i * 9 + 8]

		// overwrite c with stored a values
		normals[i * 9 + 6] = x
		normals[i * 9 + 7] = y
		normals[i * 9 + 8] = z
	}

	const verts = geometry.attributes.position.array

	// change face winding order
	for (let i = 0, l = verts.length / 9; i < l; i++) {
		// cache a coordinates
		x = verts[i * 9]
		y = verts[i * 9 + 1]
		z = verts[i * 9 + 2]

		// overwrite a with c
		verts[i * 9] = verts[i * 9 + 6]
		verts[i * 9 + 1] = verts[i * 9 + 7]
		verts[i * 9 + 2] = verts[i * 9 + 8]

		// overwrite c with stored a values
		verts[i * 9 + 6] = x
		verts[i * 9 + 7] = y
		verts[i * 9 + 8] = z
	}

	const uvs = geometry.attributes.uv.array

	// flip UV coordinates
	for (let i = 0, l = uvs.length / 6; i < l; i++) {
		// cache a coordinates
		x = uvs[i * 6]
		y = uvs[i * 6 + 1]

		// overwrite a with c
		uvs[i * 6] = uvs[i * 6 + 4]
		uvs[i * 6 + 1] = uvs[i * 6 + 5]

		// overwrite c with stored a values
		uvs[i * 6 + 4] = x
		uvs[i * 6 + 5] = y
	}

	geometry.attributes.normal.needsUpdate = true
	geometry.attributes.position.needsUpdate = true
	geometry.attributes.uv.needsUpdate = true
}

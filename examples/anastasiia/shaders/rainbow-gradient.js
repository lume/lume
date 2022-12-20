export const uniforms = {
	iTime: {value: 0},
	iResolution: {value: {x: 1, y: 1, z: 1}},
}

export const vertexShader = /*glsl*/ `
	varying vec2 vUv;

	void main() {
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	}
`

export const fragmentShader = /*glsl*/ `
	#include <common>

	uniform vec3 iResolution;
	uniform float iTime;

	// The following is the default shader when you start a new shadertoy example.
	// By iq: https://www.shadertoy.com/user/iq
	// license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

	// BEGIN SHADERTOY CODE {

	void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
		// Normalized pixel coordinates (from 0 to 1)
		vec2 uv = fragCoord/iResolution.xy;

		// Time varying pixel color
		vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

		// Output to screen
		fragColor = vec4(col,1.0);
		//fragColor = vec4(1.0, 0.3, 0.1, 1.0);
	}

	// END SHADERTOY CODE }

	varying vec2 vUv;

	void main() {
		mainImage(gl_FragColor, vUv / 2.0 * gl_FragCoord.xy);
	}
`

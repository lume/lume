import * as THREE from 'https://unpkg.com/three@0.145.0/build/three.module.js'

const loader = new THREE.TextureLoader()
const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/bayer.png')

export const uniforms = {
	iTime: {value: 0},
	iResolution: {value: {x: 0, y: 0, z: 0}},
	// TODO easier attributes, or a new <lume-shadertoy> element.
	iChannel0: {value: texture},
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
	uniform sampler2D iChannel0;

	// BEGIN SHADERTOY CODE {{

	// from https://www.shadertoy.com/view/tdG3Rd

	vec4 colormap(float x) {
		// return vec4(x * (51.0/255.0 - 129.0/255.0) + 129.0/255.0, x * (199.0/255.0 - 69.0/255.0) + 69.0/255.0, x * (199.0/255.0 - 191.0/255.0) + 191.0/255.0, 1.0);
		// return vec4(x * (129.0/255.0 - 51.0/255.0) + 51.0/255.0, x * (69.0/255.0 - 199.0/255.0) + 199.0/255.0, x * (191.0/255.0 - 199.0/255.0) + 199.0/255.0, 1.0);

		return vec4(x * (51.0/255.0 - 129.0/255.0) + 129.0/255.0, x * (199.0/255.0 - 69.0/255.0) + 69.0/255.0, x * (199.0/255.0 - 191.0/255.0) + 191.0/255.0, 1.0 - (x * (51.0/255.0 - 129.0/255.0) + 129.0/255.0));
		// return vec4(x * (51.0/255.0 - 129.0/255.0) + 129.0/255.0, x * (199.0/255.0 - 69.0/255.0) + 69.0/255.0, x * (199.0/255.0 - 191.0/255.0) + 191.0/255.0, x * (51.0/255.0 - 129.0/255.0) + 129.0/255.0);

		// 129 69 191 pink
		// 51 199 199 teal
	}

	float noise(vec2 p){
		vec2 ip = floor(p);
		vec2 u = fract(p);
		u = u*u*(3.0-2.0*u);

		float res = mix(
			mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
			mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
		return res*res;
	}

	const mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );

	float fbm( vec2 p )
	{
		float f = 0.0;

		f += 0.500000*noise( p + iTime  ); p = mtx*p*2.02;
		f += 0.031250*noise( p ); p = mtx*p*2.01;
		f += 0.250000*noise( p ); p = mtx*p*2.03;
		f += 0.125000*noise( p ); p = mtx*p*2.01;
		f += 0.062500*noise( p ); p = mtx*p*2.04;
		f += 0.015625*noise( p + sin(iTime) );

		return f/0.96875;
	}

	float pattern( in vec2 p )
	{
		return fbm( p + fbm( p + fbm( p ) ) );
	}

	void mainImage( out vec4 fragColor, in vec2 fragCoord )
	{
		vec2 uv = fragCoord/iResolution.x;
		float shade = pattern(uv);
		// fragColor = vec4(colormap(shade).rgb, 0.8);
		fragColor = vec4(colormap(shade).rgb, 0.8);
		// fragColor = vec4(colormap(shade));
	}

	// END SHADERTOY CODE }}

	varying vec2 vUv;

	void main() {
		mainImage(gl_FragColor, vUv / 2.0 * gl_FragCoord.xy);
	}
`

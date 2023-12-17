import type { IUniform, Texture } from 'three/src/Three.js';
import type { WebGLRenderer } from 'three/src/renderers/WebGLRenderer.js';
export declare function triangleBlurTexture(renderer: WebGLRenderer, texture: Texture, blur?: number, passes?: number, iterations?: number): Texture;
export declare function makeTriangleBlurShader(iterations?: number): {
    name: string;
    uniforms: {
        blurTexture: IUniform<Texture | null>;
        delta: IUniform<any>;
    };
    vertexShader: string;
    fragmentShader: string;
};
/**
 * Apply a simple vertical/horizontal Gaussian blur to a texture. The simple
 * design can make the blurred image seem like it was previously pixelated.
 * `triangleBlurTexture` offers a better blur but may also cost more.
 *
 * Adapted from https://discourse.threejs.org/t/39433
 */
export declare function verticalHorizontalGaussianBlurTexture(renderer: WebGLRenderer, texture: Texture, passes?: number): Texture;
//# sourceMappingURL=texture-blur.d.ts.map
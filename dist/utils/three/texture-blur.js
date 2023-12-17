import { Scene } from 'three/src/scenes/Scene.js';
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera.js';
import { WebGLRenderTarget } from 'three/src/renderers/WebGLRenderTarget.js';
import { Mesh, PlaneGeometry, Vector2 } from 'three/src/Three.js';
import { TriangleBlurShader } from 'three/examples/jsm/shaders/TriangleBlurShader.js';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial.js';
import { HorizontalBlurShader } from 'three/examples/jsm/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader.js';
import { Scene as ThreeScene } from 'three/src/scenes/Scene.js';
import { UniformsUtils } from 'three/src/renderers/shaders/UniformsUtils.js';
export function triangleBlurTexture(renderer, texture, blur = 0.1, passes = 1, iterations = 10) {
    const width = texture.image.width;
    const height = texture.image.height;
    // renderer = new WebGLRenderer()
    const cameraRTT = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const sceneRTT = new Scene();
    // render targets
    const renderTarget1 = new WebGLRenderTarget(width, height);
    const renderTarget2 = new WebGLRenderTarget(width, height);
    // shader materials
    const shader = makeTriangleBlurShader(iterations);
    const blurMaterial = new ShaderMaterial({
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        uniforms: UniformsUtils.clone(shader.uniforms),
    });
    blurMaterial.uniforms.delta.value = new Vector2(1, 1);
    // fullscreen quad
    const planeGeometry = new PlaneGeometry(2, 2);
    const fullScreenQuad = new Mesh(planeGeometry, blurMaterial);
    sceneRTT.add(fullScreenQuad);
    // passes
    let lastTexture = texture;
    while (passes--) {
        // vertical pass
        blurMaterial.uniforms.blurTexture.value = lastTexture;
        blurMaterial.uniforms.delta.value = new Vector2(blur, 0);
        renderer.setRenderTarget(renderTarget1);
        renderer.render(sceneRTT, cameraRTT);
        renderer.setRenderTarget(null);
        lastTexture = renderTarget1.texture;
        // horizontal pass
        blurMaterial.uniforms.blurTexture.value = lastTexture;
        blurMaterial.uniforms.delta.value = new Vector2(0, blur);
        renderer.setRenderTarget(renderTarget2);
        renderer.render(sceneRTT, cameraRTT);
        renderer.setRenderTarget(null);
        lastTexture = renderTarget2.texture;
    }
    //
    return lastTexture;
}
export function makeTriangleBlurShader(iterations = 10) {
    // Remove texture, because texture is a reserved word in WebGL 2
    const { texture, ...uniforms } = TriangleBlurShader.uniforms;
    const TriangleBlurShader2 = {
        ...TriangleBlurShader,
        name: 'TriangleBlurShader2',
        uniforms: {
            ...uniforms,
            // Replace texture with blurTexture for WebGL 2
            blurTexture: { value: null },
        },
    };
    // Replace texture with blurTexture for WebGL 2
    TriangleBlurShader2.fragmentShader = TriangleBlurShader2.fragmentShader.replace('uniform sampler2D texture;', 'uniform sampler2D blurTexture;');
    TriangleBlurShader2.fragmentShader = TriangleBlurShader2.fragmentShader.replace('texture2D( texture', 'texture2D( blurTexture');
    // Make iterations configurable.
    TriangleBlurShader2.fragmentShader = TriangleBlurShader2.fragmentShader.replace('#define ITERATIONS 10.0', '#define ITERATIONS ' + iterations + '.0');
    return TriangleBlurShader2;
}
/**
 * Apply a simple vertical/horizontal Gaussian blur to a texture. The simple
 * design can make the blurred image seem like it was previously pixelated.
 * `triangleBlurTexture` offers a better blur but may also cost more.
 *
 * Adapted from https://discourse.threejs.org/t/39433
 */
export function verticalHorizontalGaussianBlurTexture(renderer, texture, passes = 1) {
    const width = texture.image.width;
    const height = texture.image.height;
    const cameraRTT = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const sceneRTT = new ThreeScene();
    // render targets
    const renderTarget1 = new WebGLRenderTarget(width, height);
    const renderTarget2 = new WebGLRenderTarget(width, height);
    // shader materials
    const hBlurMaterial = new ShaderMaterial({
        vertexShader: HorizontalBlurShader.vertexShader,
        fragmentShader: HorizontalBlurShader.fragmentShader,
        uniforms: UniformsUtils.clone(HorizontalBlurShader.uniforms),
    });
    hBlurMaterial.uniforms.h.value = 1 / width;
    const vBlurMaterial = new ShaderMaterial({
        vertexShader: VerticalBlurShader.vertexShader,
        fragmentShader: VerticalBlurShader.fragmentShader,
        uniforms: UniformsUtils.clone(VerticalBlurShader.uniforms),
    });
    vBlurMaterial.uniforms.v.value = 1 / height;
    // fullscreen quad
    const planeGeometry = new PlaneGeometry(2, 2);
    const fullScreenQuad = new Mesh(planeGeometry, hBlurMaterial);
    sceneRTT.add(fullScreenQuad);
    // passes
    let lastTexture = texture;
    while (passes--) {
        // horizontal pass
        fullScreenQuad.material = hBlurMaterial;
        hBlurMaterial.uniforms.tDiffuse.value = lastTexture;
        renderer.setRenderTarget(renderTarget1);
        renderer.render(sceneRTT, cameraRTT);
        renderer.setRenderTarget(null);
        lastTexture = renderTarget1.texture;
        // vertical pass
        fullScreenQuad.material = vBlurMaterial;
        vBlurMaterial.uniforms.tDiffuse.value = lastTexture;
        renderer.setRenderTarget(renderTarget2);
        renderer.render(sceneRTT, cameraRTT);
        renderer.setRenderTarget(null);
        lastTexture = renderTarget2.texture;
    }
    //
    return renderTarget2.texture;
}
//# sourceMappingURL=texture-blur.js.map
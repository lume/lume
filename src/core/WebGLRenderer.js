import {
    createWebGLContext,
    //removeWebGLContext,
    setGlResolution,
    v3,
    m4,
    vertShaderSource,
    fragShaderSource,
    createShader,
    createProgram,
    Cube,
    Quad,
    FourSidedPyramid,
    IsoscelesTriangle,
    SymmetricTrapezoid,
} from './webglUtils'

const updateResolution = state => {
    const resolution = [
        parseFloat(getComputedStyle(state.gl.canvas).width) * window.devicePixelRatio,
        parseFloat(getComputedStyle(state.gl.canvas).height) * window.devicePixelRatio,
        1000,
    ]

    setGlResolution(state.gl, ...resolution)
    state.projectionMatrix = m4.perspective(45, resolution[0] / resolution[1], 1, 2000)
}

class WebGlRenderer {
    /**
     * Creates the WebGL program for the given scene.
     */
    initGl(scene) {
        const gl = createWebGLContext(scene)
        const state = scene.webGlRendererState
        state.gl = gl

        if (!gl) { console.log('You need WebGL.') }

        const vertShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSource)
        const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource)
        const program = createProgram(gl, vertShader, fragShader)
        gl.useProgram(program)


        state.colorsBuffer = gl.createBuffer()
        state.colorAttributeLocation = gl.getAttribLocation(program, 'a_color')
        gl.enableVertexAttribArray(state.colorAttributeLocation)

        state.vertexBuffer = gl.createBuffer()
        state.vertexAttributeLocation = gl.getAttribLocation(program, "a_vertexPosition")
        gl.enableVertexAttribArray(state.vertexAttributeLocation)

        state.normalsBuffer = gl.createBuffer()
        state.normalAttributeLocation = gl.getAttribLocation(program, 'a_normal')
        gl.enableVertexAttribArray(state.normalAttributeLocation)

        state.textureCoordinatesBuffer = gl.createBuffer()
        state.textureCoordinateLocation = gl.getAttribLocation(program, 'a_textureCoordinate')

        // cull_face doesn't work, because I've drawn my vertices in the wrong
        // order. They should be clockwise to be front facing (I seem to have done
        // them counter-clockwise). See "CULL_FACE" at
        // https://webglfundamentals.org/webgl/lessons/webgl-3d-orthographic.html
        //gl.enable(gl.CULL_FACE)

        // enables depth sorting, so pixels aren't drawn in order of appearance, but order only if they are visible (on top of other pixels).
        gl.enable(gl.DEPTH_TEST)

        // enable alpha blending (transparency)
        // XXX: For blending (transparency) to work, we have to disable depth testing.
        // TODO: Maybe we have to selectively enable depth testing and disable
        // blending, or vice versa, depending on the object we want to draw...
        // ...Or perhaps we must draw things in a certain order, from back to front,
        // so we can have depth testing AND blending at the same time.
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
        gl.enable(gl.BLEND)
        //gl.disable(gl.DEPTH_TEST)

        state.projectionMatrix = m4.identity

        updateResolution(state)
        scene.on('parentsizechange', () => updateResolution(state))

        state.worldViewProjectionMatrixLocation = gl.getUniformLocation(program, 'u_worldViewProjectionMatrix')
        //const worldInverseTransposeMatrixLocation = gl.getUniformLocation(program, 'u_worldInverseTransposeMatrix')
        state.worldMatrixLocation = gl.getUniformLocation(program, 'u_worldMatrix')
        //const reverseLightDirectionLocation = gl.getUniformLocation(program, 'reverseLightDirection')
        //gl.uniform3fv(reverseLightDirectionLocation, v3.normalize([0.5, 0.7, 1]))
        state.lightWorldPositionLocation = gl.getUniformLocation(program, 'u_lightWorldPosition')
        state.cameraWorldPositionLocation = gl.getUniformLocation(program, 'u_cameraWorldPosition')
        const shininessLocation = gl.getUniformLocation(program, 'u_shininess')
        const lightColorLocation = gl.getUniformLocation(program, 'u_lightColor')
        const specularColorLocation = gl.getUniformLocation(program, 'u_specularColor')
        state.textureLocation = gl.getUniformLocation(program, 'u_texture')
        state.hasTextureLocation = gl.getUniformLocation(program, 'u_hasTexture')

        let shininess = 200
        gl.uniform1f(shininessLocation, shininess)

        const red = [1, 0.6, 0.6]
        const white = [1, 1, 1]

        let lightColor = white
        gl.uniform3fv(lightColorLocation, v3.normalize(lightColor))

        let specularColor = white
        gl.uniform3fv(specularColorLocation, v3.normalize(specularColor))


        state.lightAnimParam = 0
        state.lightWorldPosition = [20,30,50]
        state.cameraAngle = 0
        state.cameraRadius   = 200
    }

    drawScene(scene) {
        const state = scene.webGlRendererState
        const {gl} = state

        // TODO: light does not affect the back side of polygons?...
        state.lightAnimParam += 0.05
        state.lightWorldPosition = [
            300*Math.sin(state.lightAnimParam),
            300*Math.sin(state.lightAnimParam*2),

            Math.abs(300*Math.cos(state.lightAnimParam))
            //300
        ]

        gl.uniform3fv(state.lightWorldPositionLocation, state.lightWorldPosition)

        let backgroundColor = scene.getAttribute('background')

        if (typeof backgroundColor == 'string')
            backgroundColor = backgroundColor.split(' ').map(rgbPart => parseFloat(rgbPart))
        else
            backgroundColor = [0, 0, 0, 0]

        gl.clearColor(...backgroundColor)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) // why do we need to do this?

        //state.cameraAngle++
        let cameraMatrix  = m4.identity
        cameraMatrix      = m4.multiply(cameraMatrix, m4.yRotation(state.cameraAngle))
        cameraMatrix      = m4.multiply(cameraMatrix, m4.translation(0, 0, state.cameraRadius * 1.5))
        const viewMatrix  = m4.inverse(cameraMatrix)

        state.viewProjectionMatrix = m4.multiply(state.projectionMatrix, viewMatrix)

        const cameraWorldPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]]
        gl.uniform3fv(state.cameraWorldPositionLocation, cameraWorldPosition)

        // TODO: we need to use the traversal that takes into consideration ShadowDOM.
        const children = scene.imperativeCounterpart._children
        for (let i=0, l=children.length; i<l; i+=1) {
            this.drawNodeAndRecurse(state, children[i])
        }
    }

    drawNodeAndRecurse(state, node) {
        const {gl} = state

        const meshAttr = node.element.getAttribute('mesh')

        if (meshAttr) {
            const size = node._calculatedSize

            const svgElement = Array.from(node.element.children)
                .find(child => child instanceof SVGSVGElement)

            const hasTexture = !!svgElement

            if (meshAttr == 'cube') {
                if (!(node.__shape instanceof Cube))
                    node.__shape = new Cube(0, 0, size.x)
                // TODO else, like quad or symtrap
            }
            else if (meshAttr == 'quad') {
                if (!(node.__shape instanceof Quad))
                    node.__shape = new Quad(size.x, size.y)
                else {
                    node.__shape.width = size.x
                    node.__shape.height = size.y
                    node.__shape._calcVerts()
                }

                if (hasTexture) {

                    // TODO we would create one per Geometry (and eventually multiple per
                    // geometry), but for now just one texture for all quads to get it working.
                    // TODO Make the texture only once, not each tick.
                    if (!node.__texture) {

                        // XXX this will eventually be set with a texture map feature
                        // TODO: for now, we should at least set default
                        // coordinates for each geometry, even if that's not
                        // ideal; it's more ideal than nothing.
                        node.__shape.textureCoordinates = new Float32Array([
                            0, 0,
                            1, 0,
                            1, 1,
                            1, 1,
                            0, 1,
                            0, 0,
                        ])

                        node.__texture = gl.createTexture()
                    }

                    ///// SVG TEXTURE FROM TWO.JS {
                    if (!node.__two) {
                        node.__two = new Two({
                            type: Two.Types.webgl,
                            fullscreen: false,
                            autostart: false,
                        })

                        node.__two.interpret(svgElement)
                    }

                    node.__two.update()

                    const image = node.__two.renderer.domElement
                    const isPowerOf2 = value => (value & (value - 1)) == 0

                    // copy the pixi canvas image to the texture.
                    gl.bindTexture(gl.TEXTURE_2D, node.__texture)
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)

                    // TODO: unbind from buffers and textures when done
                    // using them, to prevent modification from outside

                    // Mip maps can only be generated on images whose width and height are a power of 2.
                    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                        gl.generateMipmap(gl.TEXTURE_2D)
                        // TODO make filters configurable?
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)

                        // Using just NEAREST or LINEAR only can increase performance, for example.
                        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
                    }
                    else {
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
                        // TODO make filters configurable?
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
                    }
                    ///// }

                    ///// SVG TEXTURE FROM PIXI-SVG {
                    //if (!node.__pixiRenderer) {
                        //node.__pixiRenderer = PIXI.autoDetectRenderer({

                            //width: node._calculatedSize.x * window.devicePixelRatio,
                            //height: node._calculatedSize.y * window.devicePixelRatio,
                            ////width: 300 * window.devicePixelRatio,
                            ////height: 300 * window.devicePixelRatio,

                            //resolution: window.devicePixelRatio,
                        //});

                        //node.__pixiStage = new PIXI.Container()
                        //window.stage = node.__pixiStage
                    //}

                    //node.__pixiStage.removeChild(node.__svgGraphic)

                    //node.__svgGraphic = new SVG(svgElement)

                    //node.__pixiStage.addChild(node.__svgGraphic)

                    //node.__pixiRenderer.render(node.__pixiStage);

                    //const image = node.__pixiRenderer.view
                    //const isPowerOf2 = value => (value & (value - 1)) == 0

                    //// copy the pixi canvas image to the texture.
                    //gl.bindTexture(gl.TEXTURE_2D, node.__texture)
                    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)

                    //// TODO: unbind from buffers and textures when done
                    //// using them, to prevent modification from outside

                    //// Mip maps can only be generated on images whose width and height are a power of 2.
                    //if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                        //gl.generateMipmap(gl.TEXTURE_2D)
                        //// TODO make filters configurable?
                        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)

                        //// Using just NEAREST or LINEAR only can increase performance, for example.
                        ////gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                        ////gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
                    //}
                    //else {
                        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
                        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
                        //// TODO make filters configurable?
                        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
                    //}

                    ///// }

                    ///// PRE-DEFINED TEXTURE FROM IMAGE {

                    //// set a temporary solid color texture for the meantime
                    //// while the following texture loads.
                    //gl.bindTexture(gl.TEXTURE_2D, node.__texture)
                    //// Fill the texture with a 1x1 blue pixel to start with.
                    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]))
                    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

                    //const image = new Image
                    //const isPowerOf2 = value => (value & (value - 1)) == 0
                    //image.addEventListener('load', () => {
                        //// Now that the image has loaded copy it to the texture.
                        //gl.bindTexture(gl.TEXTURE_2D, node.__texture)
                        //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)

                        //// TODO: unbind from buffers and textures when done
                        //// using them, to prevent modification from outside

                        //// Mip maps can only be generated on images whose width and height are a power of 2.
                        //if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                            //gl.generateMipmap(gl.TEXTURE_2D)
                            //// TODO make filters configurable?
                            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)

                            //// Using just NEAREST or LINEAR only can increase performance, for example.
                            ////gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                            ////gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
                        //}
                        //else {
                            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
                            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
                            //// TODO make filters configurable?
                            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
                            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
                        //}
                    //})
                    //image.src = imageUrl // imageUrl should be a data URL
                    //// }
                }
            }
            else if (meshAttr == 'isotriangle') {
                if (!(node.__shape instanceof IsoscelesTriangle))
                    node.__shape = new IsoscelesTriangle(size.x, size.y)
                // TODO else, like quad or symtrap
            }
            else if (meshAttr == 'pyramid4') {
                if (!(node.__shape instanceof FourSidedPyramid))
                    node.__shape = new FourSidedPyramid(size.x, size.y)
                // TODO else, like quad or symtrap
            }
            else if (meshAttr == 'symtrap') {
                if (!(node.__shape instanceof SymmetricTrapezoid))
                    node.__shape = new SymmetricTrapezoid(size.x/2, size.x, size.y)
                else {
                    node.__shape.baseWidth = size.x/2
                    node.__shape.topWidth = size.x
                    node.__shape.height = size.y
                    node.__shape._calcVerts()
                }
            }
            //else node.__shape = null
            else {
                if (!(node.__shape instanceof Quad))
                    node.__shape = new Quad(size.x, size.y)
                else {
                    node.__shape.width = size.x
                    node.__shape.height = size.y
                    node.__shape._calcVerts()
                }
                // TODO this will eventually be set with a texture map feature
                if (hasTexture) {
                    node.__shape.textureCoordinates = new Float32Array([
                        0, 0,
                        1, 0,
                        1, 1,
                        1, 1,
                        0, 1,
                        0, 0,
                    ])
                }
            }

            if (node.__shape) {
                // COLORS /////////////////////////////////
                node.__shape.color = node.element.getAttribute('color')

                gl.bindBuffer(gl.ARRAY_BUFFER, state.colorsBuffer)
                gl.bufferData(gl.ARRAY_BUFFER, node.__shape._colors, gl.STATIC_DRAW)

                // Tell the attribute how to get data out of vertexBuffer (ARRAY_BUFFER)
                const colorSize = 4          // components per iteration
                const colorType = gl.FLOAT
                const normalizeColorData = false // don't normalize the data
                const colorStride = 0        // 0 = move forward colorSize * sizeof(colorType) each iteration to get the next vertex
                const colorOffset = 0        // start at the beginning of the buffer
                gl.vertexAttribPointer(
                    state.colorAttributeLocation, colorSize, colorType, normalizeColorData, colorStride, colorOffset)

                // VERTICES /////////////////////////////////
                gl.bindBuffer(gl.ARRAY_BUFFER, state.vertexBuffer)
                gl.bufferData(gl.ARRAY_BUFFER, node.__shape.verts, gl.STATIC_DRAW)

                // Tell the attribute how to get data out of vertexBuffer (ARRAY_BUFFER)
                const vertexSize = 3          // components per iteration
                const type = gl.FLOAT
                const normalizeVertexData = false // don't normalize the data
                const stride = 0        // 0 = move forward vertexSize * sizeof(type) each iteration to get the next vertex
                const offset = 0        // start at the beginning of the buffer
                gl.vertexAttribPointer(
                    state.vertexAttributeLocation, vertexSize, type, normalizeVertexData, stride, offset)

                // NORMALS /////////////////////////////////
                gl.bindBuffer(gl.ARRAY_BUFFER, state.normalsBuffer)
                gl.bufferData(gl.ARRAY_BUFFER, node.__shape.normals, gl.STATIC_DRAW)

                // Tell the attribute how to get data out of vertexBuffer (ARRAY_BUFFER)
                const normalSize = 3          // components per iteration
                const normalType = gl.FLOAT
                const normalizeNormalsData = false // don't normalize the data
                const normalStride = 0        // 0 = move forward normalSize * sizeof(normalType) each iteration to get the next vertex
                const normalOffset = 0        // start at the beginning of the buffer
                gl.vertexAttribPointer(
                    state.normalAttributeLocation, normalSize, normalType, normalizeNormalsData, normalStride, normalOffset)

                // TEXTURE COORDINATES /////////////////////////////////
                if (hasTexture) {
                    gl.uniform1i(state.hasTextureLocation, +true)

                    gl.bindBuffer(gl.ARRAY_BUFFER, state.textureCoordinatesBuffer)
                    gl.bufferData(gl.ARRAY_BUFFER, node.__shape.textureCoordinates, gl.STATIC_DRAW)

                    // Tell the attribute how to get data out of vertexBuffer (ARRAY_BUFFER)
                    const textureCoordinateSize = 2          // components per iteration
                    const textureCoordinateType = gl.FLOAT
                    const normalizeTextureCoordinateData = false // don't normalize the data
                    const textureCoordinateStride = 0        // 0 = move forward textureCoordinateSize * sizeof(textureCoordinateType) each iteration to get the next vertex
                    const textureCoordinateOffset = 0        // start at the beginning of the buffer
                    gl.enableVertexAttribArray(state.textureCoordinateLocation)
                    gl.vertexAttribPointer(
                        state.textureCoordinateLocation, textureCoordinateSize, textureCoordinateType, normalizeTextureCoordinateData, textureCoordinateStride, textureCoordinateOffset)

                    // Tell the shader to use texture unit 0 for u_texture
                    // TODO: Get index of the node's texture, but right now there's only one texture.
                    gl.uniform1i(state.textureLocation, 0)
                }
                else {
                    gl.uniform1i(state.hasTextureLocation, +false)
                    gl.disableVertexAttribArray(state.textureCoordinateLocation)
                }

                // TRANFORMS /////////////////////////////////
                gl.uniformMatrix4fv(state.worldMatrixLocation, false, node._worldMatrix.toFloat32Array())

                // for correct lighting normals
                // TODO: waiting for transpose() method on DOMMatrix
                //const worldInverseTransposeMatrix = m4.transpose(m4.inverse(node._worldMatrix))
                //gl.uniformMatrix4fv(worldInverseTransposeMatrixLocation, false, worldInverseTransposeMatrix)

                const worldViewProjectionMatrix = m4.multiply(state.viewProjectionMatrix, node._worldMatrix.toFloat32Array())
                gl.uniformMatrix4fv(state.worldViewProjectionMatrixLocation, false, worldViewProjectionMatrix)

                const count = node.__shape.verts.length / 3
                gl.drawArrays(gl.TRIANGLES, offset, count)
            }
        }

        const children = node._children
        for (let i=0, l=children.length; i<l; i+=1) {
            this.drawNodeAndRecurse(state, children[i])
        }
    }
}

let instance = null

export default
function getWebGlRenderer() {
    if (instance) return instance
    else return instance = new WebGlRenderer
}

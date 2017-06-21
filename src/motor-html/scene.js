
import styles from './scene-style'
import Motor from '../motor/Motor'
import Scene from '../motor/Scene'
import Observable from '../motor/Observable'
import Sizeable from '../motor/Sizeable'
import MotorHTMLBase, {initMotorHTMLBase, proxyGettersSetters} from './base'
import sleep from 'awaitbox/timers/sleep'

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
} from '../motor/webglUtils'

initMotorHTMLBase()

const privates = new WeakMap()
const _ = instance => {
    if (!privates.get(instance)) privates.set(instance, {})
    return privates.get(instance)
}

class MotorHTMLScene extends Observable.mixin(MotorHTMLBase) {

    createdCallback() {
        super.createdCallback()

        this._sizePollTask = null
        this._parentSize = {x:0, y:0, z:0}

        // After the imperativeCounterpart is available it needs to register
        // mount into DOM. This is only for MotorHTMLScenes because their
        // imperativeCounterparts are not added to a parent Node.
        // MotorHTMLNodes get their parent connection from their parent in
        // childConnectedCallback.
        this._imperativeCounterpartPromise
            .then(() => {

                if (this.imperativeCounterpart._mounted) return

                if (this.parentNode)
                    this.imperativeCounterpart.mount(this.parentNode)
            })

        // For now, use the same program (with shaders) for all objects.
        // Basically it has position, frag colors, point light, directional
        // light, and ambient light.
        // TODO: maybe call this in `init()`, and destroy webgl stuff in `deinit()`
        this.makeGlProgram()
    }

    async makeGlProgram() {
        await this.mountPromise
        this.webglEnabled = !!this.getAttribute('webglenabled')
        console.log(' ---- webgl enabled?', this.webglEnabled)
        if (!this.webglEnabled) return

        const gl = createWebGLContext(this)
        this.gl = gl

        if (!gl) { console.log('You need WebGL.') }

        const vertShader = createShader(gl, gl.VERTEX_SHADER, vertShaderSource)
        const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource)
        const program = createProgram(gl, vertShader, fragShader)
        gl.useProgram(program)


        this.colorsBuffer = gl.createBuffer()
        this.colorAttributeLocation = gl.getAttribLocation(program, 'a_color')
        gl.enableVertexAttribArray(this.colorAttributeLocation)

        this.vertexBuffer = gl.createBuffer()
        this.vertexAttributeLocation = gl.getAttribLocation(program, "a_vertexPosition")
        gl.enableVertexAttribArray(this.vertexAttributeLocation)

        this.normalsBuffer = gl.createBuffer()
        this.normalAttributeLocation = gl.getAttribLocation(program, 'a_normal')
        gl.enableVertexAttribArray(this.normalAttributeLocation)

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
        //gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
        //gl.enable(gl.BLEND)
        //gl.disable(gl.DEPTH_TEST)

        this.projectionMatrix = m4.identity

        const updateResolution = () => {
            const resolution = [
                parseFloat(getComputedStyle(gl.canvas).width) * window.devicePixelRatio,
                parseFloat(getComputedStyle(gl.canvas).height) * window.devicePixelRatio,
                1000,
            ]

            setGlResolution(gl, ...resolution)
            this.projectionMatrix = m4.perspective(45, resolution[0] / resolution[1], 1, 2000)
        }

        updateResolution()
        this.on('parentsizechange', updateResolution)

        this.worldViewProjectionMatrixLocation = gl.getUniformLocation(program, 'u_worldViewProjectionMatrix')
        //const worldInverseTransposeMatrixLocation = gl.getUniformLocation(program, 'u_worldInverseTransposeMatrix')
        this.worldMatrixLocation = gl.getUniformLocation(program, 'u_worldMatrix')
        //const reverseLightDirectionLocation = gl.getUniformLocation(program, 'reverseLightDirection')
        //gl.uniform3fv(reverseLightDirectionLocation, v3.normalize([0.5, 0.7, 1]))
        this.lightWorldPositionLocation = gl.getUniformLocation(program, 'u_lightWorldPosition')
        this.cameraWorldPositionLocation = gl.getUniformLocation(program, 'u_cameraWorldPosition')
        const shininessLocation = gl.getUniformLocation(program, 'u_shininess')
        const lightColorLocation = gl.getUniformLocation(program, 'u_lightColor')
        const specularColorLocation = gl.getUniformLocation(program, 'u_specularColor')

        let shininess = 200
        gl.uniform1f(shininessLocation, shininess)

        const red = [1, 0.6, 0.6]

        let lightColor = red
        gl.uniform3fv(lightColorLocation, v3.normalize(lightColor))

        let specularColor = red
        gl.uniform3fv(specularColorLocation, v3.normalize(specularColor))


        this.lightAnimParam = 0
        this.lightWorldPosition = [20,30,50]
        this.cameraAngle = 0
        this.cameraRadius   = 200
    }

    // This is called by Motor in each tick, only if any part of the Scene's
    // graph was modified.
    _drawGLScene() {
        const {gl} = this

        this.lightAnimParam += 0.05
        this.lightWorldPosition = [
            300*Math.sin(this.lightAnimParam),
            300*Math.sin(this.lightAnimParam*2),

            //Math.abs(600*Math.cos(this.lightAnimParam))
            300
        ]

        gl.uniform3fv(this.lightWorldPositionLocation, this.lightWorldPosition)

        let backgroundColor = this.getAttribute('background')

        if (typeof backgroundColor == 'string')
            backgroundColor = backgroundColor.split(' ').map(rgbPart => parseFloat(rgbPart))
        else
            backgroundColor = [0, 0, 0, 0]

        gl.clearColor(...backgroundColor)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) // why do we need to do this?

        //this.cameraAngle++
        let cameraMatrix  = m4.identity
        cameraMatrix      = m4.multiply(cameraMatrix, m4.yRotation(this.cameraAngle))
        cameraMatrix      = m4.multiply(cameraMatrix, m4.translation(0, 0, this.cameraRadius * 1.5))
        const viewMatrix  = m4.inverse(cameraMatrix)

        this.viewProjectionMatrix = m4.multiply(this.projectionMatrix, viewMatrix)

        const cameraWorldPosition = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]]
        gl.uniform3fv(this.cameraWorldPositionLocation, cameraWorldPosition)

        for (const child of this.imperativeCounterpart._children) {
            this._drawAndRecurse(child)
        }
    }

    _drawAndRecurse(node) {
        const {gl} = this

        const meshAttr = node.element.getAttribute('mesh')

        if (meshAttr) {
            const size = node._calculatedSize

            if (meshAttr == 'cube') {
                if (!(node.__shape instanceof Cube))
                    node.__shape = new Cube(0, 0, size.x)
            }
            else if (meshAttr == 'quad') {
                if (!(node.__shape instanceof Quad))
                    node.__shape = new Quad(size.x, size.y)
            }
            else if (meshAttr == 'isotriangle') {
                if (!(node.__shape instanceof IsoscelesTriangle))
                    node.__shape = new IsoscelesTriangle(size.x, size.y)
            }
            else if (meshAttr == 'pyramid4') {
                if (!(node.__shape instanceof FourSidedPyramid))
                    node.__shape = new FourSidedPyramid(size.x, size.y)
            }
            else if (meshAttr == 'symtrap') {
                if (!(node.__shape instanceof SymmetricTrapezoid))
                    node.__shape = new SymmetricTrapezoid(size.x/2, size.x, size.y)
            }
            //else node.__shape = null
            else node.__shape = new Cube(0, 0, size.x)

            if (node.__shape) {
                // COLORS /////////////////////////////////
                node.__shape.color = node.element.getAttribute('color')

                gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer)
                gl.bufferData(gl.ARRAY_BUFFER, node.__shape.colors, gl.STATIC_DRAW)

                // Tell the attribute how to get data out of vertexBuffer (ARRAY_BUFFER)
                const colorSize = 3;          // 3 components per iteration
                const colorType = gl.FLOAT;   // the data is 32bit floats
                const normalizeColorData = false; // don't normalize the data
                const colorStride = 0;        // 0 = move forward colorSize * sizeof(colorType) each iteration to get the next vertex
                const colorOffset = 0;        // start at the beginning of the buffer
                gl.vertexAttribPointer(
                    this.colorAttributeLocation, colorSize, colorType, normalizeColorData, colorStride, colorOffset)

                // VERTICES /////////////////////////////////
                gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
                gl.bufferData(gl.ARRAY_BUFFER, node.__shape.verts, gl.STATIC_DRAW)

                // Tell the attribute how to get data out of vertexBuffer (ARRAY_BUFFER)
                const vertexSize = 3;          // 2 components per iteration
                const type = gl.FLOAT;   // the data is 32bit floats
                const normalizeVertexData = false; // don't normalize the data
                const stride = 0;        // 0 = move forward vertexSize * sizeof(type) each iteration to get the next vertex
                const offset = 0;        // start at the beginning of the buffer
                gl.vertexAttribPointer(
                    this.vertexAttributeLocation, vertexSize, type, normalizeVertexData, stride, offset)

                // NORMALS /////////////////////////////////
                gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer)
                gl.bufferData(gl.ARRAY_BUFFER, node.__shape.normals, gl.STATIC_DRAW)

                // Tell the attribute how to get data out of vertexBuffer (ARRAY_BUFFER)
                const normalSize = 3;          // 2 components per iteration
                const normalType = gl.FLOAT;   // the data is 32bit floats
                const normalizeNormalsData = false; // don't normalize the data
                const normalStride = 0;        // 0 = move forward normalSize * sizeof(normalType) each iteration to get the next vertex
                const normalOffset = 0;        // start at the beginning of the buffer
                gl.vertexAttribPointer(
                    this.normalAttributeLocation, normalSize, normalType, normalizeNormalsData, normalStride, normalOffset)

                // TRANFORMS /////////////////////////////////
                gl.uniformMatrix4fv(this.worldMatrixLocation, false, node._worldMatrix.toFloat32Array())

                // for correct lighting normals
                // TODO: waiting for transpose() method on DOMMatrix
                //const worldInverseTransposeMatrix = m4.transpose(m4.inverse(node._worldMatrix))
                //gl.uniformMatrix4fv(worldInverseTransposeMatrixLocation, false, worldInverseTransposeMatrix)

                const worldViewProjectionMatrix = m4.multiply(this.viewProjectionMatrix, node._worldMatrix.toFloat32Array())
                gl.uniformMatrix4fv(this.worldViewProjectionMatrixLocation, false, worldViewProjectionMatrix)

                const count = node.__shape.verts.length / 3
                gl.drawArrays(gl.TRIANGLES, offset, count)
            }
        }

        for (const child of node._children) {
            this._drawAndRecurse(child)
        }
    }

    _startSizePolling() {
        // NOTE Polling is currently required because there's no other way to do this
        // reliably, not even with MutationObserver. ResizeObserver hasn't
        // landed in browsers yet.
        if (!this._sizePollTask)
            this._sizePollTask = Motor.addRenderTask(this._checkSize.bind(this))
    }

    // NOTE, the Z dimension of a scene doesn't matter, it's a flat plane, so
    // we haven't taken that into consideration here.
    _checkSize() {

        // The scene has a parent by the time this is called (see
        // src/motor/Scene#mount where _startSizePolling is called)
        const parent = this.parentNode
        const parentSize = this._parentSize
        const style = getComputedStyle(parent)
        const width = parseFloat(style.width)
        const height = parseFloat(style.height)

        // if we have a size change, trigger parentsizechange
        if (parentSize.x != width || parentSize.y != height) {
            parentSize.x = width
            parentSize.y = height

            this.triggerEvent('parentsizechange', {...parentSize})
        }
    }

    _makeImperativeCounterpart() {
        return new Scene({
            _motorHtmlCounterpart: this
        })
    }

    /** @override */
    getStyles() {
        return styles
    }

    deinit() {
        super.deinit()

        this.imperativeCounterpart.unmount()
    }

    _stopSizePolling() {
        Motor.removeRenderTask(this._sizePollTask)
        this._sizePollTask = null
    }
}

// This associates the Transformable getters/setters with the HTML-API classes,
// so that the same getters/setters can be called from HTML side of the API.
proxyGettersSetters(Sizeable, MotorHTMLScene)

import 'document-register-element'
MotorHTMLScene = document.registerElement('motor-scene', MotorHTMLScene)

export {MotorHTMLScene as default}

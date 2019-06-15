// TODO:
//  - Finish lookAt from the camera tutorial.

let targetContextMap = new WeakMap()

export function createWebGLContext(target, version) {
    const canvas = createCanvas('100%', '100%')
    const gl = getGl(canvas, version)

    if (gl) {
        if (targetContextMap.has(target)) removeWebGLContext(target)
        target.appendChild(canvas)
        targetContextMap.set(target, gl)
    }

    return gl
}

export function removeWebGLContext(target) {
    const gl = targetContextMap.get(target)
    target.removeChild(gl.canvas)
}

function createCanvas(width, height) {
    const canvas = document.createElement('canvas')
    setCanvasCSSSize(canvas, width, height)
    return canvas
}

function setCanvasCSSSize(canvas, width, height) {
    canvas.style.width = width
    canvas.style.height = height
}

export function setGlResolution(gl, width, height) {
    setCanvasRenderSize(gl.canvas, width, height)
    gl.viewport(0, 0, width, height)
}

function setCanvasRenderSize(canvas, width, height) {
    canvas.width = width
    canvas.height = height
}

function getGl(canvasOrSelector, version) {
    let canvas

    if (canvasOrSelector instanceof HTMLCanvasElement) canvas = canvasOrSelector

    if (!canvas) canvas = document.querySelector(canvasOrSelector)

    if (!(canvas instanceof HTMLCanvasElement)) return false

    if (version == 1 || version == undefined) version = ''
    else if (version == 2) version = '2'
    else throw new Error('Invalid WebGL version.')

    return canvas.getContext('webgl' + version)
}

export function createShader(gl, type, source) {
    // Create a vertex shader object
    const shader = gl.createShader(type)

    // Attach vertex shader source code
    gl.shaderSource(shader, source)

    // Compile the vertex shader
    gl.compileShader(shader)

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

    if (success) return shader

    const error = new Error("*** Error compiling shader '" + shader + "':" + gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    throw error
}

export function createProgram(gl, vertexShader, fragmentShader) {
    // Create a shader program object to store
    // the combined shader program
    const program = gl.createProgram()

    // Attach a vertex shader
    gl.attachShader(program, vertexShader)

    // Attach a fragment shader
    gl.attachShader(program, fragmentShader)

    // Link both programs
    gl.linkProgram(program)

    const success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (success) {
        return program
    }

    console.log(' --- Error making program. GL Program Info Log:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
}

export const v3 = {
    cross(a, b) {
        return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
    },

    subtract(a, b) {
        return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
    },

    add(a, b) {
        return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
    },

    normalize(v) {
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
        // make sure we don't divide by 0.
        if (length > 0.00001) {
            return [v[0] / length, v[1] / length, v[2] / length]
        } else {
            return [0, 0, 0]
        }
    },
}

class Geometry {
    constructor(...args) {
        this._init(...args)
    }

    _init() {
        this.verts = null // Float32Array
        this.normals = null // Float32Array
        this._colors = null // Float32Array
        this._color = null

        this._calcVerts()
        this.color = [0.5, 0.5, 0.5]
    }

    // TODO handle CSS color strings with tinycolor2 from NPM
    // @param {Array.number} value - array of four color values r, g, b, and a.
    // TODO: don't use accept values for color alpha, use node's opacity.
    set color(value) {
        if (!value) return

        this._color = value
        let color = null

        if (typeof value == 'string')
            color = value
                .trim()
                .split(' ')
                .map(rgbPart => parseFloat(rgbPart))
        else color = value

        // length of _colors array, considering it is four numbers per color,
        // for each vertex.
        // TODO: use a uniform instead of attributes that are all the same
        // value.
        const l = this.verts.length
        const _colorsLength = l + l / 3

        const _colors = (this._colors = new Float32Array(_colorsLength))

        for (let i = 0; i < _colorsLength; i += 4) {
            // 4 color parts per vertex
            _colors[i + 0] = color[0] // r
            _colors[i + 1] = color[1] // g
            _colors[i + 2] = color[2] // b
            _colors[i + 3] = typeof color[3] == 'undefined' ? 1 : color[3] // a
        }
    }
    get color() {
        return this._color
    }
}

export class IsoscelesTriangle extends Geometry {
    _init(width, height) {
        this.width = width // number
        this.height = height // number

        super._init()
    }

    _calcVerts() {
        const {width, height} = this

        const verts = (this.verts = new Float32Array([-width / 2, 0, 0, width / 2, 0, 0, 0, height, 0]))

        const normal = [0, 0, 1] // pointing along Z
        const normals = (this.normals = new Float32Array(verts.length))

        for (let i = 0, l = verts.length; i < l; i += 3) {
            // 3 numbers per vertex
            normals[i + 0] = normal[0]
            normals[i + 1] = normal[1]
            normals[i + 2] = normal[2]
        }
    }
}

export class SymmetricTrapezoid extends Geometry {
    // extends from TwoDeePolygon, which has same normals code.
    _init(baseWidth, topWidth, height) {
        this.baseWidth = baseWidth // number
        this.topWidth = topWidth // number
        this.height = height // number

        super._init()
    }

    _calcVerts() {
        const {baseWidth, topWidth, height} = this

        const verts = (this.verts = new Float32Array([
            -baseWidth / 2,
            0,
            0,
            baseWidth / 2,
            0,
            0,
            topWidth / 2,
            height,
            0,
            topWidth / 2,
            height,
            0,
            -topWidth / 2,
            height,
            0,
            -baseWidth / 2,
            0,
            0,
        ]))

        const normal = [0, 0, 1] // pointing along Z
        const normals = (this.normals = new Float32Array(verts.length))

        for (let i = 0, l = verts.length; i < l; i += 3) {
            // 3 numbers per vertex
            normals[i + 0] = normal[0]
            normals[i + 1] = normal[1]
            normals[i + 2] = normal[2]
        }
    }
}

export class Quad extends Geometry {
    _init(width, height) {
        this.width = width // number
        this.height = height // number

        super._init()
    }

    _calcVerts() {
        const {width, height} = this

        const verts = (this.verts = new Float32Array([
            -width / 2,
            -height / 2,
            0,
            width / 2,
            -height / 2,
            0,
            width / 2,
            height / 2,
            0,
            width / 2,
            height / 2,
            0,
            -width / 2,
            height / 2,
            0,
            -width / 2,
            -height / 2,
            0,
        ]))

        const normal = [0, 0, 1] // pointing along Z
        const normals = (this.normals = new Float32Array(verts.length))

        for (let i = 0, l = verts.length; i < l; i += 3) {
            // 3 numbers per vertex
            normals[i + 0] = normal[0]
            normals[i + 1] = normal[1]
            normals[i + 2] = normal[2]
        }
    }
}

export class Cube extends Geometry {
    _init(x, y, width) {
        // the top front left corner
        this.x = x // number
        this.y = y // number
        this.width = width // number

        super._init()
    }

    _calcVerts() {
        const {x, y, width} = this

        const x2 = x + width
        const y2 = y + width

        const verts = (this.verts = new Float32Array([
            // front face
            x,
            y,
            0,
            x2,
            y,
            0,
            x2,
            y2,
            0,
            x2,
            y2,
            0,
            x,
            y2,
            0,
            x,
            y,
            0,

            // left face
            x,
            y,
            0,
            x,
            y,
            -width,
            x,
            y2,
            -width,
            x,
            y2,
            -width,
            x,
            y2,
            0,
            x,
            y,
            0,

            // right face
            x2,
            y,
            0,
            x2,
            y,
            -width,
            x2,
            y2,
            -width,
            x2,
            y2,
            -width,
            x2,
            y2,
            0,
            x2,
            y,
            0,

            // back face
            x,
            y,
            -width,
            x2,
            y,
            -width,
            x2,
            y2,
            -width,
            x2,
            y2,
            -width,
            x,
            y2,
            -width,
            x,
            y,
            -width,

            // top face
            x,
            y,
            0,
            x,
            y,
            -width,
            x2,
            y,
            -width,
            x2,
            y,
            -width,
            x2,
            y,
            0,
            x,
            y,
            0,

            // bottom face
            x,
            y2,
            0,
            x,
            y2,
            -width,
            x2,
            y2,
            -width,
            x2,
            y2,
            -width,
            x2,
            y2,
            0,
            x,
            y2,
            0,
        ]))

        const faceNormals = [
            [0, 0, 1], // front face
            [-1, 0, 0], // left face
            [1, 0, 0], // right face
            [0, 0, -1], // back face
            [0, -1, 0], // top face
            [0, 1, 0], // bottom face
        ]

        const normals = (this.normals = new Float32Array(verts.length))

        for (let side = 0, i = 0, l = verts.length; i < l; i += 6 * 3, side += 1) {
            // 6 vertices per side, 3 numbers per vertex normal

            // first vertex
            normals[i + 0] = faceNormals[side][0]
            normals[i + 1] = faceNormals[side][1]
            normals[i + 2] = faceNormals[side][2]

            // second vertex
            normals[i + 3] = faceNormals[side][0]
            normals[i + 4] = faceNormals[side][1]
            normals[i + 5] = faceNormals[side][2]

            // third vertex
            normals[i + 6] = faceNormals[side][0]
            normals[i + 7] = faceNormals[side][1]
            normals[i + 8] = faceNormals[side][2]

            // fourth vertex
            normals[i + 9] = faceNormals[side][0]
            normals[i + 10] = faceNormals[side][1]
            normals[i + 11] = faceNormals[side][2]

            // fifth vertex
            normals[i + 12] = faceNormals[side][0]
            normals[i + 13] = faceNormals[side][1]
            normals[i + 14] = faceNormals[side][2]

            // sixth vertex
            normals[i + 15] = faceNormals[side][0]
            normals[i + 16] = faceNormals[side][1]
            normals[i + 17] = faceNormals[side][2]
        }
    }
}

export class ThreeSidedPyramid extends Geometry {
    _init(base, height) {
        this.base = base
        this.height = height

        super._init()
    }

    _calcVerts() {
        const {base, height} = this

        // base is hypotenuse in following calculations

        // TODO: this can be replaced with a loop that can make any-sided
        // pyramid.
        const verts = (this.verts = new Float32Array([
            // base
            0,
            0,
            0, // bottom front left
            base,
            0,
            0, // bottom front right
            base / 2,
            0,
            -Math.sin(degToRad(60)) * base, // bottom back

            // front
            base,
            0,
            0, // bottom front right
            0,
            0,
            0, // bottom front left
            base / 2,
            height,
            ((Math.sin(degToRad(60)) * base) / (base / 2)) * (base / 2), // tip top

            // back left
            0,
            0,
            0, // bottom front left
            base / 2,
            0,
            -Math.sin(degToRad(60)) * base, // bottom back
            base / 2,
            height,
            ((Math.sin(degToRad(60)) * base) / (base / 2)) * (base / 2), // tip top

            // back right
            base / 2,
            0,
            -Math.sin(degToRad(60)) * base, // bottom back
            base,
            0,
            0, // bottom front right
            base / 2,
            height,
            ((Math.sin(degToRad(60)) * base) / (base / 2)) * (base / 2), // tip top
        ]))

        // TODO: normals
    }
}

export class FourSidedPyramid extends Geometry {
    //_init(base, height) {
    //this.base = base
    //this.height = height

    //super._init()
    //}

    //_calcVerts() {
    //const {base, height} = this

    //// base is hypotenuse in following calculations

    //// TODO: this can be replaced with a loop that can make any-sided
    //// pyramid.
    //const verts = this.verts = new Float32Array([
    //// base
    //0, 0, 0, // bottom front left
    //base, 0, 0, // bottom front right
    //base, 0, -base, // bottom back right
    //base, 0, -base, // bottom back right
    //0, 0, -base, // bottom back left
    //0, 0, 0, // bottom front left

    //// front
    //0, 0, 0, // bottom front left
    //base, 0, 0, // bottom front right
    //base/2, height, -base/2, // tip top

    //// right
    //base, 0, 0, // bottom front right
    //base, 0, -base, // bottom back right
    //base/2, height, -base/2, // tip top

    //// back
    //base, 0, -base, // bottom back right
    //0, 0, -base, // bottom back left
    //base/2, height, -base/2, // tip top

    //// left
    //0, 0, -base, // bottom back left
    //0, 0, 0, // bottom front left
    //base/2, height, -base/2, // tip top
    //])

    //const faceNormals = [
    //// bottom
    //[0, -1, 0],

    //// front
    //v3.cross(
    //[base, 0, 0], // bottom front right
    //[base/2, height, -base/2] // tip top
    //),

    //// right
    //v3.cross(
    //[base, 0, -base], // bottom back right
    //[-base/2, height, -base/2] // tip top (-x)
    //),

    //// left
    //v3.cross(
    //[-base, 0, 0], // bottom front right (-x)
    //[-base/2, height, base/2] // tip top (-x, +z)
    //),

    //// right
    //v3.cross(
    //[0, 0, base], // bottom back left (+z)
    //[base/2, height, base/2] // tip top (+z)
    //),
    //]

    //const normals = this.normals = new Float32Array(verts.length)

    //// bottom (6 verts)
    //for (let side=0, i=0, l=6*3; i<l; i+=6*3, side+=1) { // 6 vertices per side, 3 numbers per vertex normal

    //// first vertex
    //normals[i+0]  = faceNormals[side][0]
    //normals[i+1]  = faceNormals[side][1]
    //normals[i+2]  = faceNormals[side][2]

    //// second vertex
    //normals[i+3]  = faceNormals[side][0]
    //normals[i+4]  = faceNormals[side][1]
    //normals[i+5]  = faceNormals[side][2]

    //// third vertex
    //normals[i+6]  = faceNormals[side][0]
    //normals[i+7]  = faceNormals[side][1]
    //normals[i+8]  = faceNormals[side][2]

    //// fourth vertex
    //normals[i+9]  = faceNormals[side][0]
    //normals[i+10] = faceNormals[side][1]
    //normals[i+11] = faceNormals[side][2]

    //// fifth vertex
    //normals[i+12] = faceNormals[side][0]
    //normals[i+13] = faceNormals[side][1]
    //normals[i+14] = faceNormals[side][2]

    //// sixth vertex
    //normals[i+15] = faceNormals[side][0]
    //normals[i+16] = faceNormals[side][1]
    //normals[i+17] = faceNormals[side][2]
    //}

    //// sides (3 verts each)
    //for (let side=0+1, i=0, l=verts.length - 6*3; i<l; i+=3*3, side+=1) { // 3 vertices per side, 3 numbers per vertex normal

    //// first vertex
    //normals[i+0]  = faceNormals[side][0]
    //normals[i+1]  = faceNormals[side][1]
    //normals[i+2]  = faceNormals[side][2]

    //// second vertex
    //normals[i+3]  = faceNormals[side][0]
    //normals[i+4]  = faceNormals[side][1]
    //normals[i+5]  = faceNormals[side][2]

    //// third vertex
    //normals[i+6]  = faceNormals[side][0]
    //normals[i+7]  = faceNormals[side][1]
    //normals[i+8]  = faceNormals[side][2]
    //}
    //}

    _init() {
        super._init()
    }

    _calcVerts() {
        this.verts = new Float32Array([
            -100,
            0.087303,
            -100,
            100,
            0.087303,
            -100,
            100,
            0.087303,
            100,
            -100,
            0.087303,
            100,
            100,
            0.087303,
            100,
            100,
            0.087303,
            -100,
            0,
            200.087,
            0,
            100,
            0.087303,
            -100,
            -100,
            0.087303,
            -100,
            0,
            200.087,
            0,
            -100,
            0.087303,
            -100,
            -100,
            0.087303,
            100,
            0,
            200.087,
            0,
            -100,
            0.087303,
            100,
            100,
            0.087303,
            100,
            0,
            200.087,
            0,
        ])

        this.normals = new Float32Array([
            0,
            -1,
            0,
            0,
            -1,
            0,
            0,
            -1,
            0,
            0,
            -1,
            0,
            0.894427,
            0.447214,
            0,
            0.894427,
            0.447214,
            0,
            0.894427,
            0.447214,
            0,
            0,
            0.447214,
            -0.894427,
            0,
            0.447214,
            -0.894427,
            0,
            0.447214,
            -0.894427,
            -0.894427,
            0.447214,
            0,
            -0.894427,
            0.447214,
            0,
            -0.894427,
            0.447214,
            0,
            0,
            0.447214,
            0.894427,
            0,
            0.447214,
            0.894427,
            0,
            0.447214,
            0.894427,
        ])
    }
}

export const m3 = {
    identity: Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]),

    translation(tx, ty) {
        return [1, 0, 0, 0, 1, 0, tx, ty, 1]
    },

    rotation(angleInRadians) {
        const c = Math.cos(angleInRadians)
        const s = Math.sin(angleInRadians)
        return [c, -s, 0, s, c, 0, 0, 0, 1]
    },

    scaling(sx, sy) {
        return [sx, 0, 0, 0, sy, 0, 0, 0, 1]
    },

    // Note: This matrix flips the Y axis so that 0 is at the top.
    projection(width, height) {
        // longer version, multiple matrices
        let matrix = m3.identity
        matrix = m3.multiply(m3.scaling(1 / width, 1 / height), matrix) // get the portion of clip space
        matrix = m3.multiply(m3.scaling(2, 2), matrix) // convert to clip space units
        matrix = m3.multiply(m3.translation(-1, -1), matrix) // Move from the center to bottom left
        matrix = m3.multiply(m3.scaling(1, -1), matrix) // move to the top left like DOM
        return matrix

        // shorter version, manual result of the longer version
        //return [
        //2 / width,        0,           0,
        //0,       -2 / height,      0,
        //-1,            1,           1
        //]
    },

    multiply(a, b) {
        const a00 = a[0]
        const a01 = a[1]
        const a02 = a[2]
        const a10 = a[3]
        const a11 = a[4]
        const a12 = a[5]
        const a20 = a[6]
        const a21 = a[7]
        const a22 = a[8]
        const b00 = b[0]
        const b01 = b[1]
        const b02 = b[2]
        const b10 = b[3]
        const b11 = b[4]
        const b12 = b[5]
        const b20 = b[6]
        const b21 = b[7]
        const b22 = b[8]

        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22,
        ]
    },
}

export const m4 = {
    identity: Object.freeze([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),

    translation(tx, ty, tz) {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1]
    },

    xRotation(degrees) {
        const radians = degToRad(degrees)
        const c = Math.cos(radians)
        const s = Math.sin(radians)
        return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]
    },

    yRotation(degrees) {
        const radians = degToRad(degrees)
        const c = Math.cos(radians)
        const s = Math.sin(radians)
        return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]
    },

    zRotation(degrees) {
        const radians = degToRad(degrees)
        const c = Math.cos(radians)
        const s = Math.sin(radians)
        return [c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    },

    scaling(sx, sy, sz) {
        return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1]
    },

    inverse(m) {
        const m00 = m[0 * 4 + 0]
        const m01 = m[0 * 4 + 1]
        const m02 = m[0 * 4 + 2]
        const m03 = m[0 * 4 + 3]
        const m10 = m[1 * 4 + 0]
        const m11 = m[1 * 4 + 1]
        const m12 = m[1 * 4 + 2]
        const m13 = m[1 * 4 + 3]
        const m20 = m[2 * 4 + 0]
        const m21 = m[2 * 4 + 1]
        const m22 = m[2 * 4 + 2]
        const m23 = m[2 * 4 + 3]
        const m30 = m[3 * 4 + 0]
        const m31 = m[3 * 4 + 1]
        const m32 = m[3 * 4 + 2]
        const m33 = m[3 * 4 + 3]
        const tmp_0 = m22 * m33
        const tmp_1 = m32 * m23
        const tmp_2 = m12 * m33
        const tmp_3 = m32 * m13
        const tmp_4 = m12 * m23
        const tmp_5 = m22 * m13
        const tmp_6 = m02 * m33
        const tmp_7 = m32 * m03
        const tmp_8 = m02 * m23
        const tmp_9 = m22 * m03
        const tmp_10 = m02 * m13
        const tmp_11 = m12 * m03
        const tmp_12 = m20 * m31
        const tmp_13 = m30 * m21
        const tmp_14 = m10 * m31
        const tmp_15 = m30 * m11
        const tmp_16 = m10 * m21
        const tmp_17 = m20 * m11
        const tmp_18 = m00 * m31
        const tmp_19 = m30 * m01
        const tmp_20 = m00 * m21
        const tmp_21 = m20 * m01
        const tmp_22 = m00 * m11
        const tmp_23 = m10 * m01

        const t0 = tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31 - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31)
        const t1 = tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31 - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31)
        const t2 = tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31 - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31)
        const t3 = tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21 - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21)

        const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3)

        return [
            d * t0,
            d * t1,
            d * t2,
            d * t3,
            d * (tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30 - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
            d * (tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30 - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
            d * (tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30 - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
            d * (tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20 - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
            d * (tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33 - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
            d * (tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33 - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
            d * (tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33 - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
            d * (tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23 - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
            d * (tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12 - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
            d * (tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22 - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
            d * (tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02 - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
            d * (tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12 - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02)),
        ]
    },

    transpose(m) {
        return [m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]]
    },

    // Note: This matrix flips the Y axis so that 0 is at the top.
    projection(width, height, depth) {
        // longer version, multiple matrices
        //let matrix = m4.identity
        //matrix = m4.multiply(m4.scaling(1/width, 1/height, 1/depth), matrix) // get the portion of clip space
        //matrix = m4.multiply(m4.scaling(2, 2, 2), matrix) // convert to clip space units
        //matrix = m4.multiply(m4.translation(-1, -1, 0), matrix) // Move from the center to bottom left
        //matrix = m4.multiply(m4.scaling(1, -1, 1), matrix) // move to the top left like DOM
        //return matrix

        // shorter version, manual result of the longer version
        return [2 / width, 0, 0, 0, 0, -2 / height, 0, 0, 0, 0, 2 / depth, 0, -1, 1, 0, 1]
    },

    // Note: This matrix flips the Y axis so that 0 is at the top.
    orthographic(left, right, top, bottom, near, far) {
        return [
            2 / (right - left),
            0,
            0,
            0,
            0,
            2 / (top - bottom),
            0,
            0,
            0,
            0,
            2 / (near - far),
            0,

            (left + right) / (left - right),
            (bottom + top) / (bottom - top),
            (near + far) / (near - far),
            1,
        ]
    },

    perspective(fieldOfViewInDegrees, aspect, near, far) {
        const fieldOfViewInRadians = degToRad(fieldOfViewInDegrees)
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians)
        const rangeInv = 1.0 / (near - far)

        return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (near + far) * rangeInv, -1, 0, 0, near * far * rangeInv * 2, 0]
    },

    lookAt(cameraPosition, target, up) {
        const zAxis = v3.normalize(v3.subtract(cameraPosition, target))
        const xAxis = v3.cross(up, zAxis)
        const yAxis = v3.cross(zAxis, xAxis)

        return [
            xAxis[0],
            xAxis[1],
            xAxis[2],
            0,
            yAxis[0],
            yAxis[1],
            yAxis[2],
            0,
            zAxis[0],
            zAxis[1],
            zAxis[2],
            0,
            cameraPosition[0],
            cameraPosition[1],
            cameraPosition[2],
            1,
        ]
    },

    multiply(a, b) {
        const a00 = a[0 * 4 + 0]
        const a01 = a[0 * 4 + 1]
        const a02 = a[0 * 4 + 2]
        const a03 = a[0 * 4 + 3]
        const a10 = a[1 * 4 + 0]
        const a11 = a[1 * 4 + 1]
        const a12 = a[1 * 4 + 2]
        const a13 = a[1 * 4 + 3]
        const a20 = a[2 * 4 + 0]
        const a21 = a[2 * 4 + 1]
        const a22 = a[2 * 4 + 2]
        const a23 = a[2 * 4 + 3]
        const a30 = a[3 * 4 + 0]
        const a31 = a[3 * 4 + 1]
        const a32 = a[3 * 4 + 2]
        const a33 = a[3 * 4 + 3]
        const b00 = b[0 * 4 + 0]
        const b01 = b[0 * 4 + 1]
        const b02 = b[0 * 4 + 2]
        const b03 = b[0 * 4 + 3]
        const b10 = b[1 * 4 + 0]
        const b11 = b[1 * 4 + 1]
        const b12 = b[1 * 4 + 2]
        const b13 = b[1 * 4 + 3]
        const b20 = b[2 * 4 + 0]
        const b21 = b[2 * 4 + 1]
        const b22 = b[2 * 4 + 2]
        const b23 = b[2 * 4 + 3]
        const b30 = b[3 * 4 + 0]
        const b31 = b[3 * 4 + 1]
        const b32 = b[3 * 4 + 2]
        const b33 = b[3 * 4 + 3]

        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ]
    },
}

function degToRad(degrees) {
    return (degrees * Math.PI) / 180
}

export const vertShaderSource = `
    attribute vec4 a_vertexPosition;
    uniform mat4 u_worldViewProjectionMatrix;

    // TODO: awaiting on transpose() method for DOMMatrix
    //uniform mat4 u_worldInverseTransposeMatrix; // used for correct lighting normals

    attribute vec4 a_color;
    varying vec4 v_fragColor;

    attribute vec3 a_normal;
    varying vec3 v_vertNormal;

    uniform mat4 u_worldMatrix;

    uniform vec3 u_lightWorldPosition;
    varying vec3 v_surfaceToLightVector;

    uniform vec3 u_cameraWorldPosition;
    varying vec3 v_surfaceToCameraVector;

    attribute vec2 a_textureCoordinate;
    varying vec2 v_textureCoordinate;

    void main() {
        vec3 surfaceWorldPosition = (u_worldMatrix * a_vertexPosition).xyz;

        // compute the vector of the surface to the pointLight
        // and pass it to the fragment shader
        v_surfaceToLightVector = u_lightWorldPosition - surfaceWorldPosition;

        // compute the vector of the surface to the camera
        // and pass it to the fragment shader
        v_surfaceToCameraVector = u_cameraWorldPosition - surfaceWorldPosition;

        gl_Position = u_worldViewProjectionMatrix * a_vertexPosition;

        v_fragColor = a_color;
        //v_fragColor = gl_Position * 0.5 + 0.5;

        // orient the normals and pass to the fragment shader
        //v_vertNormal = mat3(u_worldInverseTransposeMatrix) * a_normal; // TODO waiting for transpose() method on DOMMatrix
        //alternate: v_vertNormal = (u_worldInverseTransposeMatrix * vec4(a_normal, 0)).xyz;
        v_vertNormal = mat3(u_worldMatrix) * a_normal;

        v_textureCoordinate = a_textureCoordinate;
    }
`

export const fragShaderSource = `
    // TODO: detect highp support, see
    // https://github.com/greggman/webgl-fundamentals/issues/80#issuecomment-306746556
    //precision mediump float;
    precision highp float;

    varying vec4 v_fragColor;
    varying vec3 v_vertNormal;

    varying vec3 v_surfaceToLightVector;

    //// TODO: use this for directional lighting (f.e. sunlight or moonlight).
    //uniform vec3 reverseLightDirection;

    varying vec3 v_surfaceToCameraVector;

    uniform float u_shininess;
    uniform vec3 u_lightColor;
    uniform vec3 u_specularColor;

    varying vec2 v_textureCoordinate;
    uniform sampler2D u_texture;
    uniform bool u_hasTexture;

    void main(void) {

        // because v_vertNormal is a varying it's interpolated
        // so it will not be a unit vector. Normalizing it
        // will make it a unit vector again.
        vec3 normal = normalize(v_vertNormal);

        vec3 surfaceToCameraDirection = normalize(v_surfaceToCameraVector);

        vec3 surfaceToLightDirection = normalize(v_surfaceToLightVector);

        // represents the unit vector oriented at half of the angle between
        // surfaceToLightDirection and surfaceToCameraDirection.
        vec3 halfVector = normalize(surfaceToLightDirection + surfaceToCameraDirection);

        float pointLight = dot(normal, surfaceToLightDirection);
        float pointLightIntensity = 1.0; // TODO make configurable
        //float directionalLight = dot(normal, reverseLightDirection); // TODO make configurable

        //float specular = dot(normal, halfVector);
        float specular = 0.0;
        if (pointLight > 0.0) {
            specular = pow(dot(normal, halfVector), u_shininess);
        }

        // TODO make configurable
        //vec3 ambientLight = vec3(0.361, 0.184, 0.737); // teal
        vec3 ambientLight = vec3(1.0, 1.0, 1.0); // white
        float ambientLightIntensity = 0.3;

        // TODO: user can choose color or texture, default to a color if no texture, etc.
        // TODO: blend texture on top of color, if texture has alpha.
        gl_FragColor = v_fragColor;
        if (u_hasTexture) {
            gl_FragColor = texture2D(u_texture, v_textureCoordinate);
        }

        // Lets multiply just the color portion (not the alpha) of
        // gl_FragColor by the pointLight + directionalLight
        //gl_FragColor.rgb *= pointLight * u_lightColor; // point light only.
        //gl_FragColor.rgb *= directionalLight; // directional light only.
        //gl_FragColor.rgb *= ambientLight; // ambient light only.
        gl_FragColor.rgb *=
            //clamp(directionalLight, 0.0, 1.0) +
            clamp(pointLight, 0.0, 1.0) * u_lightColor * pointLightIntensity +
            ambientLight * ambientLightIntensity;

        // Just add in the specular
        gl_FragColor.rgb += specular * u_specularColor;

        //gl_FragColor.a = 0.5;
    }
`

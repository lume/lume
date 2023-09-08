import { AdditiveBlending, DoubleSide } from 'three/src/constants.js';
import { BufferGeometry } from 'three/src/core/BufferGeometry.js';
import { Color } from 'three/src/math/Color.js';
import { FileLoader } from 'three/src/loaders/FileLoader.js';
import { Float32BufferAttribute } from 'three/src/core/BufferAttribute.js';
import { Group } from 'three/src/objects/Group.js';
import { Loader } from 'three/src/loaders/Loader.js';
import { LoaderUtils } from 'three/src/loaders/LoaderUtils.js';
import { Matrix4 } from 'three/src/math/Matrix4.js';
import { Mesh } from 'three/src/objects/Mesh.js';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial.js';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
class TDSLoader extends Loader {
    constructor(manager) {
        super(manager);
        this.debug = false;
        this.group = null;
        this.materials = [];
        this.meshes = [];
    }
    load(url, onLoad, onProgress, onError) {
        const scope = this;
        const path = (this.path === '') ? LoaderUtils.extractUrlBase(url) : this.path;
        const loader = new FileLoader(this.manager);
        loader.setPath(this.path);
        loader.setResponseType('arraybuffer');
        loader.setRequestHeader(this.requestHeader);
        loader.setWithCredentials(this.withCredentials);
        loader.load(url, function (data) {
            try {
                onLoad(scope.parse(data, path));
            }
            catch (e) {
                if (onError) {
                    onError(e);
                }
                else {
                    console.error(e);
                }
                scope.manager.itemError(url);
            }
        }, onProgress, onError);
    }
    parse(arraybuffer, path) {
        this.group = new Group();
        this.materials = [];
        this.meshes = [];
        this.readFile(arraybuffer, path);
        for (let i = 0; i < this.meshes.length; i++) {
            this.group.add(this.meshes[i]);
        }
        return this.group;
    }
    readFile(arraybuffer, path) {
        const data = new DataView(arraybuffer);
        const chunk = new Chunk(data, 0, this.debugMessage);
        if (chunk.id === MLIBMAGIC || chunk.id === CMAGIC || chunk.id === M3DMAGIC) {
            let next = chunk.readChunk();
            while (next) {
                if (next.id === M3D_VERSION) {
                    const version = next.readDWord();
                    this.debugMessage('3DS file version: ' + version);
                }
                else if (next.id === MDATA) {
                    this.readMeshData(next, path);
                }
                else {
                    this.debugMessage('Unknown main chunk: ' + next.hexId);
                }
                next = chunk.readChunk();
            }
        }
        this.debugMessage('Parsed ' + this.meshes.length + ' meshes');
    }
    readMeshData(chunk, path) {
        let next = chunk.readChunk();
        while (next) {
            if (next.id === MESH_VERSION) {
                const version = +next.readDWord();
                this.debugMessage('Mesh Version: ' + version);
            }
            else if (next.id === MASTER_SCALE) {
                const scale = next.readFloat();
                this.debugMessage('Master scale: ' + scale);
                this.group.scale.set(scale, scale, scale);
            }
            else if (next.id === NAMED_OBJECT) {
                this.debugMessage('Named Object');
                this.readNamedObject(next);
            }
            else if (next.id === MAT_ENTRY) {
                this.debugMessage('Material');
                this.readMaterialEntry(next, path);
            }
            else {
                this.debugMessage('Unknown MDATA chunk: ' + next.hexId);
            }
            next = chunk.readChunk();
        }
    }
    readNamedObject(chunk) {
        const name = chunk.readString();
        let next = chunk.readChunk();
        while (next) {
            if (next.id === N_TRI_OBJECT) {
                const mesh = this.readMesh(next);
                mesh.name = name;
                this.meshes.push(mesh);
            }
            else {
                this.debugMessage('Unknown named object chunk: ' + next.hexId);
            }
            next = chunk.readChunk();
        }
    }
    readMaterialEntry(chunk, path) {
        let next = chunk.readChunk();
        const material = new MeshPhongMaterial();
        while (next) {
            if (next.id === MAT_NAME) {
                material.name = next.readString();
                this.debugMessage('   Name: ' + material.name);
            }
            else if (next.id === MAT_WIRE) {
                this.debugMessage('   Wireframe');
                material.wireframe = true;
            }
            else if (next.id === MAT_WIRE_SIZE) {
                const value = next.readByte();
                material.wireframeLinewidth = value;
                this.debugMessage('   Wireframe Thickness: ' + value);
            }
            else if (next.id === MAT_TWO_SIDE) {
                material.side = DoubleSide;
                this.debugMessage('   DoubleSided');
            }
            else if (next.id === MAT_ADDITIVE) {
                this.debugMessage('   Additive Blending');
                material.blending = AdditiveBlending;
            }
            else if (next.id === MAT_DIFFUSE) {
                this.debugMessage('   Diffuse Color');
                material.color = this.readColor(next);
            }
            else if (next.id === MAT_SPECULAR) {
                this.debugMessage('   Specular Color');
                material.specular = this.readColor(next);
            }
            else if (next.id === MAT_AMBIENT) {
                this.debugMessage('   Ambient color');
                material.color = this.readColor(next);
            }
            else if (next.id === MAT_SHININESS) {
                const shininess = this.readPercentage(next);
                material.shininess = shininess * 100;
                this.debugMessage('   Shininess : ' + shininess);
            }
            else if (next.id === MAT_TRANSPARENCY) {
                const transparency = this.readPercentage(next);
                material.opacity = 1 - transparency;
                this.debugMessage('  Transparency : ' + transparency);
                material.transparent = material.opacity < 1 ? true : false;
            }
            else if (next.id === MAT_TEXMAP) {
                this.debugMessage('   ColorMap');
                material.map = this.readMap(next, path);
            }
            else if (next.id === MAT_BUMPMAP) {
                this.debugMessage('   BumpMap');
                material.bumpMap = this.readMap(next, path);
            }
            else if (next.id === MAT_OPACMAP) {
                this.debugMessage('   OpacityMap');
                material.alphaMap = this.readMap(next, path);
            }
            else if (next.id === MAT_SPECMAP) {
                this.debugMessage('   SpecularMap');
                material.specularMap = this.readMap(next, path);
            }
            else {
                this.debugMessage('   Unknown material chunk: ' + next.hexId);
            }
            next = chunk.readChunk();
        }
        this.materials[material.name] = material;
    }
    readMesh(chunk) {
        let next = chunk.readChunk();
        const geometry = new BufferGeometry();
        const material = new MeshPhongMaterial();
        const mesh = new Mesh(geometry, material);
        mesh.name = 'mesh';
        while (next) {
            if (next.id === POINT_ARRAY) {
                const points = next.readWord();
                this.debugMessage('   Vertex: ' + points);
                const vertices = [];
                for (let i = 0; i < points; i++) {
                    vertices.push(next.readFloat());
                    vertices.push(next.readFloat());
                    vertices.push(next.readFloat());
                }
                geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
            }
            else if (next.id === FACE_ARRAY) {
                this.readFaceArray(next, mesh);
            }
            else if (next.id === TEX_VERTS) {
                const texels = next.readWord();
                this.debugMessage('   UV: ' + texels);
                const uvs = [];
                for (let i = 0; i < texels; i++) {
                    uvs.push(next.readFloat());
                    uvs.push(next.readFloat());
                }
                geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
            }
            else if (next.id === MESH_MATRIX) {
                this.debugMessage('   Tranformation Matrix (TODO)');
                const values = [];
                for (let i = 0; i < 12; i++) {
                    values[i] = next.readFloat();
                }
                const matrix = new Matrix4();
                matrix.elements[0] = values[0];
                matrix.elements[1] = values[6];
                matrix.elements[2] = values[3];
                matrix.elements[3] = values[9];
                matrix.elements[4] = values[2];
                matrix.elements[5] = values[8];
                matrix.elements[6] = values[5];
                matrix.elements[7] = values[11];
                matrix.elements[8] = values[1];
                matrix.elements[9] = values[7];
                matrix.elements[10] = values[4];
                matrix.elements[11] = values[10];
                matrix.elements[12] = 0;
                matrix.elements[13] = 0;
                matrix.elements[14] = 0;
                matrix.elements[15] = 1;
                matrix.transpose();
                const inverse = new Matrix4();
                inverse.copy(matrix).invert();
                geometry.applyMatrix4(inverse);
                matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
            }
            else {
                this.debugMessage('   Unknown mesh chunk: ' + next.hexId);
            }
            next = chunk.readChunk();
        }
        geometry.computeVertexNormals();
        return mesh;
    }
    readFaceArray(chunk, mesh) {
        const faces = chunk.readWord();
        this.debugMessage('   Faces: ' + faces);
        const index = [];
        for (let i = 0; i < faces; ++i) {
            index.push(chunk.readWord(), chunk.readWord(), chunk.readWord());
            chunk.readWord();
        }
        mesh.geometry.setIndex(index);
        let materialIndex = 0;
        let start = 0;
        while (!chunk.endOfChunk) {
            const subchunk = chunk.readChunk();
            if (subchunk.id === MSH_MAT_GROUP) {
                this.debugMessage('      Material Group');
                const group = this.readMaterialGroup(subchunk);
                const count = group.index.length * 3;
                mesh.geometry.addGroup(start, count, materialIndex);
                start += count;
                materialIndex++;
                const material = this.materials[group.name];
                if (Array.isArray(mesh.material) === false)
                    mesh.material = [];
                if (material !== undefined) {
                    mesh.material.push(material);
                }
            }
            else {
                this.debugMessage('      Unknown face array chunk: ' + subchunk.hexId);
            }
        }
        if (mesh.material.length === 1)
            mesh.material = mesh.material[0];
    }
    readMap(chunk, path) {
        let next = chunk.readChunk();
        let texture = {};
        const loader = new TextureLoader(this.manager);
        loader.setPath(this.resourcePath || path).setCrossOrigin(this.crossOrigin);
        while (next) {
            if (next.id === MAT_MAPNAME) {
                const name = next.readString();
                texture = loader.load(name);
                this.debugMessage('      File: ' + path + name);
            }
            else if (next.id === MAT_MAP_UOFFSET) {
                texture.offset.x = next.readFloat();
                this.debugMessage('      OffsetX: ' + texture.offset.x);
            }
            else if (next.id === MAT_MAP_VOFFSET) {
                texture.offset.y = next.readFloat();
                this.debugMessage('      OffsetY: ' + texture.offset.y);
            }
            else if (next.id === MAT_MAP_USCALE) {
                texture.repeat.x = next.readFloat();
                this.debugMessage('      RepeatX: ' + texture.repeat.x);
            }
            else if (next.id === MAT_MAP_VSCALE) {
                texture.repeat.y = next.readFloat();
                this.debugMessage('      RepeatY: ' + texture.repeat.y);
            }
            else {
                this.debugMessage('      Unknown map chunk: ' + next.hexId);
            }
            next = chunk.readChunk();
        }
        return texture;
    }
    readMaterialGroup(chunk) {
        const name = chunk.readString();
        const numFaces = chunk.readWord();
        this.debugMessage('         Name: ' + name);
        this.debugMessage('         Faces: ' + numFaces);
        const index = [];
        for (let i = 0; i < numFaces; ++i) {
            index.push(chunk.readWord());
        }
        return { name: name, index: index };
    }
    readColor(chunk) {
        const subChunk = chunk.readChunk();
        const color = new Color();
        if (subChunk.id === COLOR_24 || subChunk.id === LIN_COLOR_24) {
            const r = subChunk.readByte();
            const g = subChunk.readByte();
            const b = subChunk.readByte();
            color.setRGB(r / 255, g / 255, b / 255);
            this.debugMessage('      Color: ' + color.r + ', ' + color.g + ', ' + color.b);
        }
        else if (subChunk.id === COLOR_F || subChunk.id === LIN_COLOR_F) {
            const r = subChunk.readFloat();
            const g = subChunk.readFloat();
            const b = subChunk.readFloat();
            color.setRGB(r, g, b);
            this.debugMessage('      Color: ' + color.r + ', ' + color.g + ', ' + color.b);
        }
        else {
            this.debugMessage('      Unknown color chunk: ' + subChunk.hexId);
        }
        return color;
    }
    readPercentage(chunk) {
        const subChunk = chunk.readChunk();
        switch (subChunk.id) {
            case INT_PERCENTAGE:
                return (subChunk.readShort() / 100);
                break;
            case FLOAT_PERCENTAGE:
                return subChunk.readFloat();
                break;
            default:
                this.debugMessage('      Unknown percentage chunk: ' + subChunk.hexId);
                return 0;
        }
    }
    debugMessage(message) {
        if (this.debug) {
            console.log(message);
        }
    }
}
class Chunk {
    constructor(data, position, debugMessage) {
        this.data = data;
        this.offset = position;
        this.position = position;
        this.debugMessage = debugMessage;
        if (this.debugMessage instanceof Function) {
            this.debugMessage = function () { };
        }
        this.id = this.readWord();
        this.size = this.readDWord();
        this.end = this.offset + this.size;
        if (this.end > data.byteLength) {
            this.debugMessage('Bad chunk size for chunk at ' + position);
        }
    }
    readChunk() {
        if (this.endOfChunk) {
            return null;
        }
        try {
            const next = new Chunk(this.data, this.position, this.debugMessage);
            this.position += next.size;
            return next;
        }
        catch (e) {
            this.debugMessage('Unable to read chunk at ' + this.position);
            return null;
        }
    }
    get hexId() {
        return this.id.toString(16);
    }
    get endOfChunk() {
        return this.position >= this.end;
    }
    readByte() {
        const v = this.data.getUint8(this.position, true);
        this.position += 1;
        return v;
    }
    readFloat() {
        try {
            const v = this.data.getFloat32(this.position, true);
            this.position += 4;
            return v;
        }
        catch (e) {
            this.debugMessage(e + ' ' + this.position + ' ' + this.data.byteLength);
            return 0;
        }
    }
    readInt() {
        const v = this.data.getInt32(this.position, true);
        this.position += 4;
        return v;
    }
    readShort() {
        const v = this.data.getInt16(this.position, true);
        this.position += 2;
        return v;
    }
    readDWord() {
        const v = this.data.getUint32(this.position, true);
        this.position += 4;
        return v;
    }
    readWord() {
        const v = this.data.getUint16(this.position, true);
        this.position += 2;
        return v;
    }
    readString() {
        let s = '';
        let c = this.readByte();
        while (c) {
            s += String.fromCharCode(c);
            c = this.readByte();
        }
        return s;
    }
}
const M3DMAGIC = 0x4D4D;
const MLIBMAGIC = 0x3DAA;
const CMAGIC = 0xC23D;
const M3D_VERSION = 0x0002;
const COLOR_F = 0x0010;
const COLOR_24 = 0x0011;
const LIN_COLOR_24 = 0x0012;
const LIN_COLOR_F = 0x0013;
const INT_PERCENTAGE = 0x0030;
const FLOAT_PERCENTAGE = 0x0031;
const MDATA = 0x3D3D;
const MESH_VERSION = 0x3D3E;
const MASTER_SCALE = 0x0100;
const MAT_ENTRY = 0xAFFF;
const MAT_NAME = 0xA000;
const MAT_AMBIENT = 0xA010;
const MAT_DIFFUSE = 0xA020;
const MAT_SPECULAR = 0xA030;
const MAT_SHININESS = 0xA040;
const MAT_TRANSPARENCY = 0xA050;
const MAT_TWO_SIDE = 0xA081;
const MAT_ADDITIVE = 0xA083;
const MAT_WIRE = 0xA085;
const MAT_WIRE_SIZE = 0xA087;
const MAT_TEXMAP = 0xA200;
const MAT_OPACMAP = 0xA210;
const MAT_BUMPMAP = 0xA230;
const MAT_SPECMAP = 0xA204;
const MAT_MAPNAME = 0xA300;
const MAT_MAP_USCALE = 0xA354;
const MAT_MAP_VSCALE = 0xA356;
const MAT_MAP_UOFFSET = 0xA358;
const MAT_MAP_VOFFSET = 0xA35A;
const NAMED_OBJECT = 0x4000;
const N_TRI_OBJECT = 0x4100;
const POINT_ARRAY = 0x4110;
const FACE_ARRAY = 0x4120;
const MSH_MAT_GROUP = 0x4130;
const TEX_VERTS = 0x4140;
const MESH_MATRIX = 0x4160;
export { TDSLoader };
//# sourceMappingURL=TDSLoader.js.map
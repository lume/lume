import { AmbientLight } from 'three/src/lights/AmbientLight.js';
import { AnimationClip } from 'three/src/animation/AnimationClip.js';
import { Bone } from 'three/src/objects/Bone.js';
import { BufferGeometry } from 'three/src/core/BufferGeometry.js';
import { ClampToEdgeWrapping, EquirectangularReflectionMapping, RepeatWrapping, sRGBEncoding } from 'three/src/constants.js';
import { Color } from 'three/src/math/Color.js';
import { DirectionalLight } from 'three/src/lights/DirectionalLight.js';
import { Euler } from 'three/src/math/Euler.js';
import { FileLoader } from 'three/src/loaders/FileLoader.js';
import { Float32BufferAttribute } from 'three/src/core/BufferAttribute.js';
import { Group } from 'three/src/objects/Group.js';
import { Line } from 'three/src/objects/Line.js';
import { LineBasicMaterial } from 'three/src/materials/LineBasicMaterial.js';
import { Loader } from 'three/src/loaders/Loader.js';
import { LoaderUtils } from 'three/src/loaders/LoaderUtils.js';
import * as MathUtils from 'three/src/math/MathUtils.js';
import { Matrix3 } from 'three/src/math/Matrix3.js';
import { Matrix4 } from 'three/src/math/Matrix4.js';
import { Mesh } from 'three/src/objects/Mesh.js';
import { MeshLambertMaterial } from 'three/src/materials/MeshLambertMaterial.js';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial.js';
import { NumberKeyframeTrack } from 'three/src/animation/tracks/NumberKeyframeTrack.js';
import { Object3D } from 'three/src/core/Object3D.js';
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera.js';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera.js';
import { PointLight } from 'three/src/lights/PointLight.js';
import { PropertyBinding } from 'three/src/animation/PropertyBinding.js';
import { Quaternion } from 'three/src/math/Quaternion.js';
import { QuaternionKeyframeTrack } from 'three/src/animation/tracks/QuaternionKeyframeTrack.js';
import { Skeleton } from 'three/src/objects/Skeleton.js';
import { SkinnedMesh } from 'three/src/objects/SkinnedMesh.js';
import { SpotLight } from 'three/src/lights/SpotLight.js';
import { Texture } from 'three/src/textures/Texture.js';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
import { Uint16BufferAttribute } from 'three/src/core/BufferAttribute.js';
import { Vector3 } from 'three/src/math/Vector3.js';
import { Vector4 } from 'three/src/math/Vector4.js';
import { VectorKeyframeTrack } from 'three/src/animation/tracks/VectorKeyframeTrack.js';
import * as fflate from 'three/examples/jsm/libs/fflate.module.js';
import { NURBSCurve } from '../curves/NURBSCurve.js';
let fbxTree;
let connections;
let sceneGraph;
class FBXLoader extends Loader {
    constructor(manager) {
        super(manager);
    }
    load(url, onLoad, onProgress, onError) {
        const scope = this;
        const path = (scope.path === '') ? LoaderUtils.extractUrlBase(url) : scope.path;
        const loader = new FileLoader(this.manager);
        loader.setPath(scope.path);
        loader.setResponseType('arraybuffer');
        loader.setRequestHeader(scope.requestHeader);
        loader.setWithCredentials(scope.withCredentials);
        loader.load(url, function (buffer) {
            try {
                onLoad(scope.parse(buffer, path));
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
    parse(FBXBuffer, path) {
        if (isFbxFormatBinary(FBXBuffer)) {
            fbxTree = new BinaryParser().parse(FBXBuffer);
        }
        else {
            const FBXText = convertArrayBufferToString(FBXBuffer);
            if (!isFbxFormatASCII(FBXText)) {
                throw new Error('THREE.FBXLoader: Unknown format.');
            }
            if (getFbxVersion(FBXText) < 7000) {
                throw new Error('THREE.FBXLoader: FBX version not supported, FileVersion: ' + getFbxVersion(FBXText));
            }
            fbxTree = new TextParser().parse(FBXText);
        }
        const textureLoader = new TextureLoader(this.manager).setPath(this.resourcePath || path).setCrossOrigin(this.crossOrigin);
        return new FBXTreeParser(textureLoader, this.manager).parse(fbxTree);
    }
}
class FBXTreeParser {
    constructor(textureLoader, manager) {
        this.textureLoader = textureLoader;
        this.manager = manager;
    }
    parse() {
        connections = this.parseConnections();
        const images = this.parseImages();
        const textures = this.parseTextures(images);
        const materials = this.parseMaterials(textures);
        const deformers = this.parseDeformers();
        const geometryMap = new GeometryParser().parse(deformers);
        this.parseScene(deformers, geometryMap, materials);
        return sceneGraph;
    }
    parseConnections() {
        const connectionMap = new Map();
        if ('Connections' in fbxTree) {
            const rawConnections = fbxTree.Connections.connections;
            rawConnections.forEach(function (rawConnection) {
                const fromID = rawConnection[0];
                const toID = rawConnection[1];
                const relationship = rawConnection[2];
                if (!connectionMap.has(fromID)) {
                    connectionMap.set(fromID, {
                        parents: [],
                        children: []
                    });
                }
                const parentRelationship = { ID: toID, relationship: relationship };
                connectionMap.get(fromID).parents.push(parentRelationship);
                if (!connectionMap.has(toID)) {
                    connectionMap.set(toID, {
                        parents: [],
                        children: []
                    });
                }
                const childRelationship = { ID: fromID, relationship: relationship };
                connectionMap.get(toID).children.push(childRelationship);
            });
        }
        return connectionMap;
    }
    parseImages() {
        const images = {};
        const blobs = {};
        if ('Video' in fbxTree.Objects) {
            const videoNodes = fbxTree.Objects.Video;
            for (const nodeID in videoNodes) {
                const videoNode = videoNodes[nodeID];
                const id = parseInt(nodeID);
                images[id] = videoNode.RelativeFilename || videoNode.Filename;
                if ('Content' in videoNode) {
                    const arrayBufferContent = (videoNode.Content instanceof ArrayBuffer) && (videoNode.Content.byteLength > 0);
                    const base64Content = (typeof videoNode.Content === 'string') && (videoNode.Content !== '');
                    if (arrayBufferContent || base64Content) {
                        const image = this.parseImage(videoNodes[nodeID]);
                        blobs[videoNode.RelativeFilename || videoNode.Filename] = image;
                    }
                }
            }
        }
        for (const id in images) {
            const filename = images[id];
            if (blobs[filename] !== undefined)
                images[id] = blobs[filename];
            else
                images[id] = images[id].split('\\').pop();
        }
        return images;
    }
    parseImage(videoNode) {
        const content = videoNode.Content;
        const fileName = videoNode.RelativeFilename || videoNode.Filename;
        const extension = fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();
        let type;
        switch (extension) {
            case 'bmp':
                type = 'image/bmp';
                break;
            case 'jpg':
            case 'jpeg':
                type = 'image/jpeg';
                break;
            case 'png':
                type = 'image/png';
                break;
            case 'tif':
                type = 'image/tiff';
                break;
            case 'tga':
                if (this.manager.getHandler('.tga') === null) {
                    console.warn('FBXLoader: TGA loader not found, skipping ', fileName);
                }
                type = 'image/tga';
                break;
            default:
                console.warn('FBXLoader: Image type "' + extension + '" is not supported.');
                return;
        }
        if (typeof content === 'string') {
            return 'data:' + type + ';base64,' + content;
        }
        else {
            const array = new Uint8Array(content);
            return window.URL.createObjectURL(new Blob([array], { type: type }));
        }
    }
    parseTextures(images) {
        const textureMap = new Map();
        if ('Texture' in fbxTree.Objects) {
            const textureNodes = fbxTree.Objects.Texture;
            for (const nodeID in textureNodes) {
                const texture = this.parseTexture(textureNodes[nodeID], images);
                textureMap.set(parseInt(nodeID), texture);
            }
        }
        return textureMap;
    }
    parseTexture(textureNode, images) {
        const texture = this.loadTexture(textureNode, images);
        texture.ID = textureNode.id;
        texture.name = textureNode.attrName;
        const wrapModeU = textureNode.WrapModeU;
        const wrapModeV = textureNode.WrapModeV;
        const valueU = wrapModeU !== undefined ? wrapModeU.value : 0;
        const valueV = wrapModeV !== undefined ? wrapModeV.value : 0;
        texture.wrapS = valueU === 0 ? RepeatWrapping : ClampToEdgeWrapping;
        texture.wrapT = valueV === 0 ? RepeatWrapping : ClampToEdgeWrapping;
        if ('Scaling' in textureNode) {
            const values = textureNode.Scaling.value;
            texture.repeat.x = values[0];
            texture.repeat.y = values[1];
        }
        return texture;
    }
    loadTexture(textureNode, images) {
        let fileName;
        const currentPath = this.textureLoader.path;
        const children = connections.get(textureNode.id).children;
        if (children !== undefined && children.length > 0 && images[children[0].ID] !== undefined) {
            fileName = images[children[0].ID];
            if (fileName.indexOf('blob:') === 0 || fileName.indexOf('data:') === 0) {
                this.textureLoader.setPath(undefined);
            }
        }
        let texture;
        const extension = textureNode.FileName.slice(-3).toLowerCase();
        if (extension === 'tga') {
            const loader = this.manager.getHandler('.tga');
            if (loader === null) {
                console.warn('FBXLoader: TGA loader not found, creating placeholder texture for', textureNode.RelativeFilename);
                texture = new Texture();
            }
            else {
                loader.setPath(this.textureLoader.path);
                texture = loader.load(fileName);
            }
        }
        else if (extension === 'psd') {
            console.warn('FBXLoader: PSD textures are not supported, creating placeholder texture for', textureNode.RelativeFilename);
            texture = new Texture();
        }
        else {
            texture = this.textureLoader.load(fileName);
        }
        this.textureLoader.setPath(currentPath);
        return texture;
    }
    parseMaterials(textureMap) {
        const materialMap = new Map();
        if ('Material' in fbxTree.Objects) {
            const materialNodes = fbxTree.Objects.Material;
            for (const nodeID in materialNodes) {
                const material = this.parseMaterial(materialNodes[nodeID], textureMap);
                if (material !== null)
                    materialMap.set(parseInt(nodeID), material);
            }
        }
        return materialMap;
    }
    parseMaterial(materialNode, textureMap) {
        const ID = materialNode.id;
        const name = materialNode.attrName;
        let type = materialNode.ShadingModel;
        if (typeof type === 'object') {
            type = type.value;
        }
        if (!connections.has(ID))
            return null;
        const parameters = this.parseParameters(materialNode, textureMap, ID);
        let material;
        switch (type.toLowerCase()) {
            case 'phong':
                material = new MeshPhongMaterial();
                break;
            case 'lambert':
                material = new MeshLambertMaterial();
                break;
            default:
                console.warn('THREE.FBXLoader: unknown material type "%s". Defaulting to MeshPhongMaterial.', type);
                material = new MeshPhongMaterial();
                break;
        }
        material.setValues(parameters);
        material.name = name;
        return material;
    }
    parseParameters(materialNode, textureMap, ID) {
        const parameters = {};
        if (materialNode.BumpFactor) {
            parameters.bumpScale = materialNode.BumpFactor.value;
        }
        if (materialNode.Diffuse) {
            parameters.color = new Color().fromArray(materialNode.Diffuse.value);
        }
        else if (materialNode.DiffuseColor && (materialNode.DiffuseColor.type === 'Color' || materialNode.DiffuseColor.type === 'ColorRGB')) {
            parameters.color = new Color().fromArray(materialNode.DiffuseColor.value);
        }
        if (materialNode.DisplacementFactor) {
            parameters.displacementScale = materialNode.DisplacementFactor.value;
        }
        if (materialNode.Emissive) {
            parameters.emissive = new Color().fromArray(materialNode.Emissive.value);
        }
        else if (materialNode.EmissiveColor && (materialNode.EmissiveColor.type === 'Color' || materialNode.EmissiveColor.type === 'ColorRGB')) {
            parameters.emissive = new Color().fromArray(materialNode.EmissiveColor.value);
        }
        if (materialNode.EmissiveFactor) {
            parameters.emissiveIntensity = parseFloat(materialNode.EmissiveFactor.value);
        }
        if (materialNode.Opacity) {
            parameters.opacity = parseFloat(materialNode.Opacity.value);
        }
        if (parameters.opacity < 1.0) {
            parameters.transparent = true;
        }
        if (materialNode.ReflectionFactor) {
            parameters.reflectivity = materialNode.ReflectionFactor.value;
        }
        if (materialNode.Shininess) {
            parameters.shininess = materialNode.Shininess.value;
        }
        if (materialNode.Specular) {
            parameters.specular = new Color().fromArray(materialNode.Specular.value);
        }
        else if (materialNode.SpecularColor && materialNode.SpecularColor.type === 'Color') {
            parameters.specular = new Color().fromArray(materialNode.SpecularColor.value);
        }
        const scope = this;
        connections.get(ID).children.forEach(function (child) {
            const type = child.relationship;
            switch (type) {
                case 'Bump':
                    parameters.bumpMap = scope.getTexture(textureMap, child.ID);
                    break;
                case 'Maya|TEX_ao_map':
                    parameters.aoMap = scope.getTexture(textureMap, child.ID);
                    break;
                case 'DiffuseColor':
                case 'Maya|TEX_color_map':
                    parameters.map = scope.getTexture(textureMap, child.ID);
                    if (parameters.map !== undefined) {
                        parameters.map.encoding = sRGBEncoding;
                    }
                    break;
                case 'DisplacementColor':
                    parameters.displacementMap = scope.getTexture(textureMap, child.ID);
                    break;
                case 'EmissiveColor':
                    parameters.emissiveMap = scope.getTexture(textureMap, child.ID);
                    if (parameters.emissiveMap !== undefined) {
                        parameters.emissiveMap.encoding = sRGBEncoding;
                    }
                    break;
                case 'NormalMap':
                case 'Maya|TEX_normal_map':
                    parameters.normalMap = scope.getTexture(textureMap, child.ID);
                    break;
                case 'ReflectionColor':
                    parameters.envMap = scope.getTexture(textureMap, child.ID);
                    if (parameters.envMap !== undefined) {
                        parameters.envMap.mapping = EquirectangularReflectionMapping;
                        parameters.envMap.encoding = sRGBEncoding;
                    }
                    break;
                case 'SpecularColor':
                    parameters.specularMap = scope.getTexture(textureMap, child.ID);
                    if (parameters.specularMap !== undefined) {
                        parameters.specularMap.encoding = sRGBEncoding;
                    }
                    break;
                case 'TransparentColor':
                case 'TransparencyFactor':
                    parameters.alphaMap = scope.getTexture(textureMap, child.ID);
                    parameters.transparent = true;
                    break;
                case 'AmbientColor':
                case 'ShininessExponent':
                case 'SpecularFactor':
                case 'VectorDisplacementColor':
                default:
                    console.warn('THREE.FBXLoader: %s map is not supported in three.js, skipping texture.', type);
                    break;
            }
        });
        return parameters;
    }
    getTexture(textureMap, id) {
        if ('LayeredTexture' in fbxTree.Objects && id in fbxTree.Objects.LayeredTexture) {
            console.warn('THREE.FBXLoader: layered textures are not supported in three.js. Discarding all but first layer.');
            id = connections.get(id).children[0].ID;
        }
        return textureMap.get(id);
    }
    parseDeformers() {
        const skeletons = {};
        const morphTargets = {};
        if ('Deformer' in fbxTree.Objects) {
            const DeformerNodes = fbxTree.Objects.Deformer;
            for (const nodeID in DeformerNodes) {
                const deformerNode = DeformerNodes[nodeID];
                const relationships = connections.get(parseInt(nodeID));
                if (deformerNode.attrType === 'Skin') {
                    const skeleton = this.parseSkeleton(relationships, DeformerNodes);
                    skeleton.ID = nodeID;
                    if (relationships.parents.length > 1)
                        console.warn('THREE.FBXLoader: skeleton attached to more than one geometry is not supported.');
                    skeleton.geometryID = relationships.parents[0].ID;
                    skeletons[nodeID] = skeleton;
                }
                else if (deformerNode.attrType === 'BlendShape') {
                    const morphTarget = {
                        id: nodeID,
                    };
                    morphTarget.rawTargets = this.parseMorphTargets(relationships, DeformerNodes);
                    morphTarget.id = nodeID;
                    if (relationships.parents.length > 1)
                        console.warn('THREE.FBXLoader: morph target attached to more than one geometry is not supported.');
                    morphTargets[nodeID] = morphTarget;
                }
            }
        }
        return {
            skeletons: skeletons,
            morphTargets: morphTargets,
        };
    }
    parseSkeleton(relationships, deformerNodes) {
        const rawBones = [];
        relationships.children.forEach(function (child) {
            const boneNode = deformerNodes[child.ID];
            if (boneNode.attrType !== 'Cluster')
                return;
            const rawBone = {
                ID: child.ID,
                indices: [],
                weights: [],
                transformLink: new Matrix4().fromArray(boneNode.TransformLink.a),
            };
            if ('Indexes' in boneNode) {
                rawBone.indices = boneNode.Indexes.a;
                rawBone.weights = boneNode.Weights.a;
            }
            rawBones.push(rawBone);
        });
        return {
            rawBones: rawBones,
            bones: []
        };
    }
    parseMorphTargets(relationships, deformerNodes) {
        const rawMorphTargets = [];
        for (let i = 0; i < relationships.children.length; i++) {
            const child = relationships.children[i];
            const morphTargetNode = deformerNodes[child.ID];
            const rawMorphTarget = {
                name: morphTargetNode.attrName,
                initialWeight: morphTargetNode.DeformPercent,
                id: morphTargetNode.id,
                fullWeights: morphTargetNode.FullWeights.a
            };
            if (morphTargetNode.attrType !== 'BlendShapeChannel')
                return;
            rawMorphTarget.geoID = connections.get(parseInt(child.ID)).children.filter(function (child) {
                return child.relationship === undefined;
            })[0].ID;
            rawMorphTargets.push(rawMorphTarget);
        }
        return rawMorphTargets;
    }
    parseScene(deformers, geometryMap, materialMap) {
        sceneGraph = new Group();
        const modelMap = this.parseModels(deformers.skeletons, geometryMap, materialMap);
        const modelNodes = fbxTree.Objects.Model;
        const scope = this;
        modelMap.forEach(function (model) {
            const modelNode = modelNodes[model.ID];
            scope.setLookAtProperties(model, modelNode);
            const parentConnections = connections.get(model.ID).parents;
            parentConnections.forEach(function (connection) {
                const parent = modelMap.get(connection.ID);
                if (parent !== undefined)
                    parent.add(model);
            });
            if (model.parent === null) {
                sceneGraph.add(model);
            }
        });
        this.bindSkeleton(deformers.skeletons, geometryMap, modelMap);
        this.createAmbientLight();
        sceneGraph.traverse(function (node) {
            if (node.userData.transformData) {
                if (node.parent) {
                    node.userData.transformData.parentMatrix = node.parent.matrix;
                    node.userData.transformData.parentMatrixWorld = node.parent.matrixWorld;
                }
                const transform = generateTransform(node.userData.transformData);
                node.applyMatrix4(transform);
                node.updateWorldMatrix();
            }
        });
        const animations = new AnimationParser().parse();
        if (sceneGraph.children.length === 1 && sceneGraph.children[0].isGroup) {
            sceneGraph.children[0].animations = animations;
            sceneGraph = sceneGraph.children[0];
        }
        sceneGraph.animations = animations;
    }
    parseModels(skeletons, geometryMap, materialMap) {
        const modelMap = new Map();
        const modelNodes = fbxTree.Objects.Model;
        for (const nodeID in modelNodes) {
            const id = parseInt(nodeID);
            const node = modelNodes[nodeID];
            const relationships = connections.get(id);
            let model = this.buildSkeleton(relationships, skeletons, id, node.attrName);
            if (!model) {
                switch (node.attrType) {
                    case 'Camera':
                        model = this.createCamera(relationships);
                        break;
                    case 'Light':
                        model = this.createLight(relationships);
                        break;
                    case 'Mesh':
                        model = this.createMesh(relationships, geometryMap, materialMap);
                        break;
                    case 'NurbsCurve':
                        model = this.createCurve(relationships, geometryMap);
                        break;
                    case 'LimbNode':
                    case 'Root':
                        model = new Bone();
                        break;
                    case 'Null':
                    default:
                        model = new Group();
                        break;
                }
                model.name = node.attrName ? PropertyBinding.sanitizeNodeName(node.attrName) : '';
                model.ID = id;
            }
            this.getTransformData(model, node);
            modelMap.set(id, model);
        }
        return modelMap;
    }
    buildSkeleton(relationships, skeletons, id, name) {
        let bone = null;
        relationships.parents.forEach(function (parent) {
            for (const ID in skeletons) {
                const skeleton = skeletons[ID];
                skeleton.rawBones.forEach(function (rawBone, i) {
                    if (rawBone.ID === parent.ID) {
                        const subBone = bone;
                        bone = new Bone();
                        bone.matrixWorld.copy(rawBone.transformLink);
                        bone.name = name ? PropertyBinding.sanitizeNodeName(name) : '';
                        bone.ID = id;
                        skeleton.bones[i] = bone;
                        if (subBone !== null) {
                            bone.add(subBone);
                        }
                    }
                });
            }
        });
        return bone;
    }
    createCamera(relationships) {
        let model;
        let cameraAttribute;
        relationships.children.forEach(function (child) {
            const attr = fbxTree.Objects.NodeAttribute[child.ID];
            if (attr !== undefined) {
                cameraAttribute = attr;
            }
        });
        if (cameraAttribute === undefined) {
            model = new Object3D();
        }
        else {
            let type = 0;
            if (cameraAttribute.CameraProjectionType !== undefined && cameraAttribute.CameraProjectionType.value === 1) {
                type = 1;
            }
            let nearClippingPlane = 1;
            if (cameraAttribute.NearPlane !== undefined) {
                nearClippingPlane = cameraAttribute.NearPlane.value / 1000;
            }
            let farClippingPlane = 1000;
            if (cameraAttribute.FarPlane !== undefined) {
                farClippingPlane = cameraAttribute.FarPlane.value / 1000;
            }
            let width = window.innerWidth;
            let height = window.innerHeight;
            if (cameraAttribute.AspectWidth !== undefined && cameraAttribute.AspectHeight !== undefined) {
                width = cameraAttribute.AspectWidth.value;
                height = cameraAttribute.AspectHeight.value;
            }
            const aspect = width / height;
            let fov = 45;
            if (cameraAttribute.FieldOfView !== undefined) {
                fov = cameraAttribute.FieldOfView.value;
            }
            const focalLength = cameraAttribute.FocalLength ? cameraAttribute.FocalLength.value : null;
            switch (type) {
                case 0:
                    model = new PerspectiveCamera(fov, aspect, nearClippingPlane, farClippingPlane);
                    if (focalLength !== null)
                        model.setFocalLength(focalLength);
                    break;
                case 1:
                    model = new OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, nearClippingPlane, farClippingPlane);
                    break;
                default:
                    console.warn('THREE.FBXLoader: Unknown camera type ' + type + '.');
                    model = new Object3D();
                    break;
            }
        }
        return model;
    }
    createLight(relationships) {
        let model;
        let lightAttribute;
        relationships.children.forEach(function (child) {
            const attr = fbxTree.Objects.NodeAttribute[child.ID];
            if (attr !== undefined) {
                lightAttribute = attr;
            }
        });
        if (lightAttribute === undefined) {
            model = new Object3D();
        }
        else {
            let type;
            if (lightAttribute.LightType === undefined) {
                type = 0;
            }
            else {
                type = lightAttribute.LightType.value;
            }
            let color = 0xffffff;
            if (lightAttribute.Color !== undefined) {
                color = new Color().fromArray(lightAttribute.Color.value);
            }
            let intensity = (lightAttribute.Intensity === undefined) ? 1 : lightAttribute.Intensity.value / 100;
            if (lightAttribute.CastLightOnObject !== undefined && lightAttribute.CastLightOnObject.value === 0) {
                intensity = 0;
            }
            let distance = 0;
            if (lightAttribute.FarAttenuationEnd !== undefined) {
                if (lightAttribute.EnableFarAttenuation !== undefined && lightAttribute.EnableFarAttenuation.value === 0) {
                    distance = 0;
                }
                else {
                    distance = lightAttribute.FarAttenuationEnd.value;
                }
            }
            const decay = 1;
            switch (type) {
                case 0:
                    model = new PointLight(color, intensity, distance, decay);
                    break;
                case 1:
                    model = new DirectionalLight(color, intensity);
                    break;
                case 2:
                    let angle = Math.PI / 3;
                    if (lightAttribute.InnerAngle !== undefined) {
                        angle = MathUtils.degToRad(lightAttribute.InnerAngle.value);
                    }
                    let penumbra = 0;
                    if (lightAttribute.OuterAngle !== undefined) {
                        penumbra = MathUtils.degToRad(lightAttribute.OuterAngle.value);
                        penumbra = Math.max(penumbra, 1);
                    }
                    model = new SpotLight(color, intensity, distance, angle, penumbra, decay);
                    break;
                default:
                    console.warn('THREE.FBXLoader: Unknown light type ' + lightAttribute.LightType.value + ', defaulting to a PointLight.');
                    model = new PointLight(color, intensity);
                    break;
            }
            if (lightAttribute.CastShadows !== undefined && lightAttribute.CastShadows.value === 1) {
                model.castShadow = true;
            }
        }
        return model;
    }
    createMesh(relationships, geometryMap, materialMap) {
        let model;
        let geometry = null;
        let material = null;
        const materials = [];
        relationships.children.forEach(function (child) {
            if (geometryMap.has(child.ID)) {
                geometry = geometryMap.get(child.ID);
            }
            if (materialMap.has(child.ID)) {
                materials.push(materialMap.get(child.ID));
            }
        });
        if (materials.length > 1) {
            material = materials;
        }
        else if (materials.length > 0) {
            material = materials[0];
        }
        else {
            material = new MeshPhongMaterial({ color: 0xcccccc });
            materials.push(material);
        }
        if ('color' in geometry.attributes) {
            materials.forEach(function (material) {
                material.vertexColors = true;
            });
        }
        if (geometry.FBX_Deformer) {
            model = new SkinnedMesh(geometry, material);
            model.normalizeSkinWeights();
        }
        else {
            model = new Mesh(geometry, material);
        }
        return model;
    }
    createCurve(relationships, geometryMap) {
        const geometry = relationships.children.reduce(function (geo, child) {
            if (geometryMap.has(child.ID))
                geo = geometryMap.get(child.ID);
            return geo;
        }, null);
        const material = new LineBasicMaterial({ color: 0x3300ff, linewidth: 1 });
        return new Line(geometry, material);
    }
    getTransformData(model, modelNode) {
        const transformData = {};
        if ('InheritType' in modelNode)
            transformData.inheritType = parseInt(modelNode.InheritType.value);
        if ('RotationOrder' in modelNode)
            transformData.eulerOrder = getEulerOrder(modelNode.RotationOrder.value);
        else
            transformData.eulerOrder = 'ZYX';
        if ('Lcl_Translation' in modelNode)
            transformData.translation = modelNode.Lcl_Translation.value;
        if ('PreRotation' in modelNode)
            transformData.preRotation = modelNode.PreRotation.value;
        if ('Lcl_Rotation' in modelNode)
            transformData.rotation = modelNode.Lcl_Rotation.value;
        if ('PostRotation' in modelNode)
            transformData.postRotation = modelNode.PostRotation.value;
        if ('Lcl_Scaling' in modelNode)
            transformData.scale = modelNode.Lcl_Scaling.value;
        if ('ScalingOffset' in modelNode)
            transformData.scalingOffset = modelNode.ScalingOffset.value;
        if ('ScalingPivot' in modelNode)
            transformData.scalingPivot = modelNode.ScalingPivot.value;
        if ('RotationOffset' in modelNode)
            transformData.rotationOffset = modelNode.RotationOffset.value;
        if ('RotationPivot' in modelNode)
            transformData.rotationPivot = modelNode.RotationPivot.value;
        model.userData.transformData = transformData;
    }
    setLookAtProperties(model, modelNode) {
        if ('LookAtProperty' in modelNode) {
            const children = connections.get(model.ID).children;
            children.forEach(function (child) {
                if (child.relationship === 'LookAtProperty') {
                    const lookAtTarget = fbxTree.Objects.Model[child.ID];
                    if ('Lcl_Translation' in lookAtTarget) {
                        const pos = lookAtTarget.Lcl_Translation.value;
                        if (model.target !== undefined) {
                            model.target.position.fromArray(pos);
                            sceneGraph.add(model.target);
                        }
                        else {
                            model.lookAt(new Vector3().fromArray(pos));
                        }
                    }
                }
            });
        }
    }
    bindSkeleton(skeletons, geometryMap, modelMap) {
        const bindMatrices = this.parsePoseNodes();
        for (const ID in skeletons) {
            const skeleton = skeletons[ID];
            const parents = connections.get(parseInt(skeleton.ID)).parents;
            parents.forEach(function (parent) {
                if (geometryMap.has(parent.ID)) {
                    const geoID = parent.ID;
                    const geoRelationships = connections.get(geoID);
                    geoRelationships.parents.forEach(function (geoConnParent) {
                        if (modelMap.has(geoConnParent.ID)) {
                            const model = modelMap.get(geoConnParent.ID);
                            model.bind(new Skeleton(skeleton.bones), bindMatrices[geoConnParent.ID]);
                        }
                    });
                }
            });
        }
    }
    parsePoseNodes() {
        const bindMatrices = {};
        if ('Pose' in fbxTree.Objects) {
            const BindPoseNode = fbxTree.Objects.Pose;
            for (const nodeID in BindPoseNode) {
                if (BindPoseNode[nodeID].attrType === 'BindPose' && BindPoseNode[nodeID].NbPoseNodes > 0) {
                    const poseNodes = BindPoseNode[nodeID].PoseNode;
                    if (Array.isArray(poseNodes)) {
                        poseNodes.forEach(function (poseNode) {
                            bindMatrices[poseNode.Node] = new Matrix4().fromArray(poseNode.Matrix.a);
                        });
                    }
                    else {
                        bindMatrices[poseNodes.Node] = new Matrix4().fromArray(poseNodes.Matrix.a);
                    }
                }
            }
        }
        return bindMatrices;
    }
    createAmbientLight() {
        if ('GlobalSettings' in fbxTree && 'AmbientColor' in fbxTree.GlobalSettings) {
            const ambientColor = fbxTree.GlobalSettings.AmbientColor.value;
            const r = ambientColor[0];
            const g = ambientColor[1];
            const b = ambientColor[2];
            if (r !== 0 || g !== 0 || b !== 0) {
                const color = new Color(r, g, b);
                sceneGraph.add(new AmbientLight(color, 1));
            }
        }
    }
}
class GeometryParser {
    parse(deformers) {
        const geometryMap = new Map();
        if ('Geometry' in fbxTree.Objects) {
            const geoNodes = fbxTree.Objects.Geometry;
            for (const nodeID in geoNodes) {
                const relationships = connections.get(parseInt(nodeID));
                const geo = this.parseGeometry(relationships, geoNodes[nodeID], deformers);
                geometryMap.set(parseInt(nodeID), geo);
            }
        }
        return geometryMap;
    }
    parseGeometry(relationships, geoNode, deformers) {
        switch (geoNode.attrType) {
            case 'Mesh':
                return this.parseMeshGeometry(relationships, geoNode, deformers);
                break;
            case 'NurbsCurve':
                return this.parseNurbsGeometry(geoNode);
                break;
        }
    }
    parseMeshGeometry(relationships, geoNode, deformers) {
        const skeletons = deformers.skeletons;
        const morphTargets = [];
        const modelNodes = relationships.parents.map(function (parent) {
            return fbxTree.Objects.Model[parent.ID];
        });
        if (modelNodes.length === 0)
            return;
        const skeleton = relationships.children.reduce(function (skeleton, child) {
            if (skeletons[child.ID] !== undefined)
                skeleton = skeletons[child.ID];
            return skeleton;
        }, null);
        relationships.children.forEach(function (child) {
            if (deformers.morphTargets[child.ID] !== undefined) {
                morphTargets.push(deformers.morphTargets[child.ID]);
            }
        });
        const modelNode = modelNodes[0];
        const transformData = {};
        if ('RotationOrder' in modelNode)
            transformData.eulerOrder = getEulerOrder(modelNode.RotationOrder.value);
        if ('InheritType' in modelNode)
            transformData.inheritType = parseInt(modelNode.InheritType.value);
        if ('GeometricTranslation' in modelNode)
            transformData.translation = modelNode.GeometricTranslation.value;
        if ('GeometricRotation' in modelNode)
            transformData.rotation = modelNode.GeometricRotation.value;
        if ('GeometricScaling' in modelNode)
            transformData.scale = modelNode.GeometricScaling.value;
        const transform = generateTransform(transformData);
        return this.genGeometry(geoNode, skeleton, morphTargets, transform);
    }
    genGeometry(geoNode, skeleton, morphTargets, preTransform) {
        const geo = new BufferGeometry();
        if (geoNode.attrName)
            geo.name = geoNode.attrName;
        const geoInfo = this.parseGeoNode(geoNode, skeleton);
        const buffers = this.genBuffers(geoInfo);
        const positionAttribute = new Float32BufferAttribute(buffers.vertex, 3);
        positionAttribute.applyMatrix4(preTransform);
        geo.setAttribute('position', positionAttribute);
        if (buffers.colors.length > 0) {
            geo.setAttribute('color', new Float32BufferAttribute(buffers.colors, 3));
        }
        if (skeleton) {
            geo.setAttribute('skinIndex', new Uint16BufferAttribute(buffers.weightsIndices, 4));
            geo.setAttribute('skinWeight', new Float32BufferAttribute(buffers.vertexWeights, 4));
            geo.FBX_Deformer = skeleton;
        }
        if (buffers.normal.length > 0) {
            const normalMatrix = new Matrix3().getNormalMatrix(preTransform);
            const normalAttribute = new Float32BufferAttribute(buffers.normal, 3);
            normalAttribute.applyNormalMatrix(normalMatrix);
            geo.setAttribute('normal', normalAttribute);
        }
        buffers.uvs.forEach(function (uvBuffer, i) {
            let name = 'uv' + (i + 1).toString();
            if (i === 0) {
                name = 'uv';
            }
            geo.setAttribute(name, new Float32BufferAttribute(buffers.uvs[i], 2));
        });
        if (geoInfo.material && geoInfo.material.mappingType !== 'AllSame') {
            let prevMaterialIndex = buffers.materialIndex[0];
            let startIndex = 0;
            buffers.materialIndex.forEach(function (currentIndex, i) {
                if (currentIndex !== prevMaterialIndex) {
                    geo.addGroup(startIndex, i - startIndex, prevMaterialIndex);
                    prevMaterialIndex = currentIndex;
                    startIndex = i;
                }
            });
            if (geo.groups.length > 0) {
                const lastGroup = geo.groups[geo.groups.length - 1];
                const lastIndex = lastGroup.start + lastGroup.count;
                if (lastIndex !== buffers.materialIndex.length) {
                    geo.addGroup(lastIndex, buffers.materialIndex.length - lastIndex, prevMaterialIndex);
                }
            }
            if (geo.groups.length === 0) {
                geo.addGroup(0, buffers.materialIndex.length, buffers.materialIndex[0]);
            }
        }
        this.addMorphTargets(geo, geoNode, morphTargets, preTransform);
        return geo;
    }
    parseGeoNode(geoNode, skeleton) {
        const geoInfo = {};
        geoInfo.vertexPositions = (geoNode.Vertices !== undefined) ? geoNode.Vertices.a : [];
        geoInfo.vertexIndices = (geoNode.PolygonVertexIndex !== undefined) ? geoNode.PolygonVertexIndex.a : [];
        if (geoNode.LayerElementColor) {
            geoInfo.color = this.parseVertexColors(geoNode.LayerElementColor[0]);
        }
        if (geoNode.LayerElementMaterial) {
            geoInfo.material = this.parseMaterialIndices(geoNode.LayerElementMaterial[0]);
        }
        if (geoNode.LayerElementNormal) {
            geoInfo.normal = this.parseNormals(geoNode.LayerElementNormal[0]);
        }
        if (geoNode.LayerElementUV) {
            geoInfo.uv = [];
            let i = 0;
            while (geoNode.LayerElementUV[i]) {
                if (geoNode.LayerElementUV[i].UV) {
                    geoInfo.uv.push(this.parseUVs(geoNode.LayerElementUV[i]));
                }
                i++;
            }
        }
        geoInfo.weightTable = {};
        if (skeleton !== null) {
            geoInfo.skeleton = skeleton;
            skeleton.rawBones.forEach(function (rawBone, i) {
                rawBone.indices.forEach(function (index, j) {
                    if (geoInfo.weightTable[index] === undefined)
                        geoInfo.weightTable[index] = [];
                    geoInfo.weightTable[index].push({
                        id: i,
                        weight: rawBone.weights[j],
                    });
                });
            });
        }
        return geoInfo;
    }
    genBuffers(geoInfo) {
        const buffers = {
            vertex: [],
            normal: [],
            colors: [],
            uvs: [],
            materialIndex: [],
            vertexWeights: [],
            weightsIndices: [],
        };
        let polygonIndex = 0;
        let faceLength = 0;
        let displayedWeightsWarning = false;
        let facePositionIndexes = [];
        let faceNormals = [];
        let faceColors = [];
        let faceUVs = [];
        let faceWeights = [];
        let faceWeightIndices = [];
        const scope = this;
        geoInfo.vertexIndices.forEach(function (vertexIndex, polygonVertexIndex) {
            let materialIndex;
            let endOfFace = false;
            if (vertexIndex < 0) {
                vertexIndex = vertexIndex ^ -1;
                endOfFace = true;
            }
            let weightIndices = [];
            let weights = [];
            facePositionIndexes.push(vertexIndex * 3, vertexIndex * 3 + 1, vertexIndex * 3 + 2);
            if (geoInfo.color) {
                const data = getData(polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.color);
                faceColors.push(data[0], data[1], data[2]);
            }
            if (geoInfo.skeleton) {
                if (geoInfo.weightTable[vertexIndex] !== undefined) {
                    geoInfo.weightTable[vertexIndex].forEach(function (wt) {
                        weights.push(wt.weight);
                        weightIndices.push(wt.id);
                    });
                }
                if (weights.length > 4) {
                    if (!displayedWeightsWarning) {
                        console.warn('THREE.FBXLoader: Vertex has more than 4 skinning weights assigned to vertex. Deleting additional weights.');
                        displayedWeightsWarning = true;
                    }
                    const wIndex = [0, 0, 0, 0];
                    const Weight = [0, 0, 0, 0];
                    weights.forEach(function (weight, weightIndex) {
                        let currentWeight = weight;
                        let currentIndex = weightIndices[weightIndex];
                        Weight.forEach(function (comparedWeight, comparedWeightIndex, comparedWeightArray) {
                            if (currentWeight > comparedWeight) {
                                comparedWeightArray[comparedWeightIndex] = currentWeight;
                                currentWeight = comparedWeight;
                                const tmp = wIndex[comparedWeightIndex];
                                wIndex[comparedWeightIndex] = currentIndex;
                                currentIndex = tmp;
                            }
                        });
                    });
                    weightIndices = wIndex;
                    weights = Weight;
                }
                while (weights.length < 4) {
                    weights.push(0);
                    weightIndices.push(0);
                }
                for (let i = 0; i < 4; ++i) {
                    faceWeights.push(weights[i]);
                    faceWeightIndices.push(weightIndices[i]);
                }
            }
            if (geoInfo.normal) {
                const data = getData(polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.normal);
                faceNormals.push(data[0], data[1], data[2]);
            }
            if (geoInfo.material && geoInfo.material.mappingType !== 'AllSame') {
                materialIndex = getData(polygonVertexIndex, polygonIndex, vertexIndex, geoInfo.material)[0];
            }
            if (geoInfo.uv) {
                geoInfo.uv.forEach(function (uv, i) {
                    const data = getData(polygonVertexIndex, polygonIndex, vertexIndex, uv);
                    if (faceUVs[i] === undefined) {
                        faceUVs[i] = [];
                    }
                    faceUVs[i].push(data[0]);
                    faceUVs[i].push(data[1]);
                });
            }
            faceLength++;
            if (endOfFace) {
                scope.genFace(buffers, geoInfo, facePositionIndexes, materialIndex, faceNormals, faceColors, faceUVs, faceWeights, faceWeightIndices, faceLength);
                polygonIndex++;
                faceLength = 0;
                facePositionIndexes = [];
                faceNormals = [];
                faceColors = [];
                faceUVs = [];
                faceWeights = [];
                faceWeightIndices = [];
            }
        });
        return buffers;
    }
    genFace(buffers, geoInfo, facePositionIndexes, materialIndex, faceNormals, faceColors, faceUVs, faceWeights, faceWeightIndices, faceLength) {
        for (let i = 2; i < faceLength; i++) {
            buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[0]]);
            buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[1]]);
            buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[2]]);
            buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[(i - 1) * 3]]);
            buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[(i - 1) * 3 + 1]]);
            buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[(i - 1) * 3 + 2]]);
            buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[i * 3]]);
            buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[i * 3 + 1]]);
            buffers.vertex.push(geoInfo.vertexPositions[facePositionIndexes[i * 3 + 2]]);
            if (geoInfo.skeleton) {
                buffers.vertexWeights.push(faceWeights[0]);
                buffers.vertexWeights.push(faceWeights[1]);
                buffers.vertexWeights.push(faceWeights[2]);
                buffers.vertexWeights.push(faceWeights[3]);
                buffers.vertexWeights.push(faceWeights[(i - 1) * 4]);
                buffers.vertexWeights.push(faceWeights[(i - 1) * 4 + 1]);
                buffers.vertexWeights.push(faceWeights[(i - 1) * 4 + 2]);
                buffers.vertexWeights.push(faceWeights[(i - 1) * 4 + 3]);
                buffers.vertexWeights.push(faceWeights[i * 4]);
                buffers.vertexWeights.push(faceWeights[i * 4 + 1]);
                buffers.vertexWeights.push(faceWeights[i * 4 + 2]);
                buffers.vertexWeights.push(faceWeights[i * 4 + 3]);
                buffers.weightsIndices.push(faceWeightIndices[0]);
                buffers.weightsIndices.push(faceWeightIndices[1]);
                buffers.weightsIndices.push(faceWeightIndices[2]);
                buffers.weightsIndices.push(faceWeightIndices[3]);
                buffers.weightsIndices.push(faceWeightIndices[(i - 1) * 4]);
                buffers.weightsIndices.push(faceWeightIndices[(i - 1) * 4 + 1]);
                buffers.weightsIndices.push(faceWeightIndices[(i - 1) * 4 + 2]);
                buffers.weightsIndices.push(faceWeightIndices[(i - 1) * 4 + 3]);
                buffers.weightsIndices.push(faceWeightIndices[i * 4]);
                buffers.weightsIndices.push(faceWeightIndices[i * 4 + 1]);
                buffers.weightsIndices.push(faceWeightIndices[i * 4 + 2]);
                buffers.weightsIndices.push(faceWeightIndices[i * 4 + 3]);
            }
            if (geoInfo.color) {
                buffers.colors.push(faceColors[0]);
                buffers.colors.push(faceColors[1]);
                buffers.colors.push(faceColors[2]);
                buffers.colors.push(faceColors[(i - 1) * 3]);
                buffers.colors.push(faceColors[(i - 1) * 3 + 1]);
                buffers.colors.push(faceColors[(i - 1) * 3 + 2]);
                buffers.colors.push(faceColors[i * 3]);
                buffers.colors.push(faceColors[i * 3 + 1]);
                buffers.colors.push(faceColors[i * 3 + 2]);
            }
            if (geoInfo.material && geoInfo.material.mappingType !== 'AllSame') {
                buffers.materialIndex.push(materialIndex);
                buffers.materialIndex.push(materialIndex);
                buffers.materialIndex.push(materialIndex);
            }
            if (geoInfo.normal) {
                buffers.normal.push(faceNormals[0]);
                buffers.normal.push(faceNormals[1]);
                buffers.normal.push(faceNormals[2]);
                buffers.normal.push(faceNormals[(i - 1) * 3]);
                buffers.normal.push(faceNormals[(i - 1) * 3 + 1]);
                buffers.normal.push(faceNormals[(i - 1) * 3 + 2]);
                buffers.normal.push(faceNormals[i * 3]);
                buffers.normal.push(faceNormals[i * 3 + 1]);
                buffers.normal.push(faceNormals[i * 3 + 2]);
            }
            if (geoInfo.uv) {
                geoInfo.uv.forEach(function (uv, j) {
                    if (buffers.uvs[j] === undefined)
                        buffers.uvs[j] = [];
                    buffers.uvs[j].push(faceUVs[j][0]);
                    buffers.uvs[j].push(faceUVs[j][1]);
                    buffers.uvs[j].push(faceUVs[j][(i - 1) * 2]);
                    buffers.uvs[j].push(faceUVs[j][(i - 1) * 2 + 1]);
                    buffers.uvs[j].push(faceUVs[j][i * 2]);
                    buffers.uvs[j].push(faceUVs[j][i * 2 + 1]);
                });
            }
        }
    }
    addMorphTargets(parentGeo, parentGeoNode, morphTargets, preTransform) {
        if (morphTargets.length === 0)
            return;
        parentGeo.morphTargetsRelative = true;
        parentGeo.morphAttributes.position = [];
        const scope = this;
        morphTargets.forEach(function (morphTarget) {
            morphTarget.rawTargets.forEach(function (rawTarget) {
                const morphGeoNode = fbxTree.Objects.Geometry[rawTarget.geoID];
                if (morphGeoNode !== undefined) {
                    scope.genMorphGeometry(parentGeo, parentGeoNode, morphGeoNode, preTransform, rawTarget.name);
                }
            });
        });
    }
    genMorphGeometry(parentGeo, parentGeoNode, morphGeoNode, preTransform, name) {
        const vertexIndices = (parentGeoNode.PolygonVertexIndex !== undefined) ? parentGeoNode.PolygonVertexIndex.a : [];
        const morphPositionsSparse = (morphGeoNode.Vertices !== undefined) ? morphGeoNode.Vertices.a : [];
        const indices = (morphGeoNode.Indexes !== undefined) ? morphGeoNode.Indexes.a : [];
        const length = parentGeo.attributes.position.count * 3;
        const morphPositions = new Float32Array(length);
        for (let i = 0; i < indices.length; i++) {
            const morphIndex = indices[i] * 3;
            morphPositions[morphIndex] = morphPositionsSparse[i * 3];
            morphPositions[morphIndex + 1] = morphPositionsSparse[i * 3 + 1];
            morphPositions[morphIndex + 2] = morphPositionsSparse[i * 3 + 2];
        }
        const morphGeoInfo = {
            vertexIndices: vertexIndices,
            vertexPositions: morphPositions,
        };
        const morphBuffers = this.genBuffers(morphGeoInfo);
        const positionAttribute = new Float32BufferAttribute(morphBuffers.vertex, 3);
        positionAttribute.name = name || morphGeoNode.attrName;
        positionAttribute.applyMatrix4(preTransform);
        parentGeo.morphAttributes.position.push(positionAttribute);
    }
    parseNormals(NormalNode) {
        const mappingType = NormalNode.MappingInformationType;
        const referenceType = NormalNode.ReferenceInformationType;
        const buffer = NormalNode.Normals.a;
        let indexBuffer = [];
        if (referenceType === 'IndexToDirect') {
            if ('NormalIndex' in NormalNode) {
                indexBuffer = NormalNode.NormalIndex.a;
            }
            else if ('NormalsIndex' in NormalNode) {
                indexBuffer = NormalNode.NormalsIndex.a;
            }
        }
        return {
            dataSize: 3,
            buffer: buffer,
            indices: indexBuffer,
            mappingType: mappingType,
            referenceType: referenceType
        };
    }
    parseUVs(UVNode) {
        const mappingType = UVNode.MappingInformationType;
        const referenceType = UVNode.ReferenceInformationType;
        const buffer = UVNode.UV.a;
        let indexBuffer = [];
        if (referenceType === 'IndexToDirect') {
            indexBuffer = UVNode.UVIndex.a;
        }
        return {
            dataSize: 2,
            buffer: buffer,
            indices: indexBuffer,
            mappingType: mappingType,
            referenceType: referenceType
        };
    }
    parseVertexColors(ColorNode) {
        const mappingType = ColorNode.MappingInformationType;
        const referenceType = ColorNode.ReferenceInformationType;
        const buffer = ColorNode.Colors.a;
        let indexBuffer = [];
        if (referenceType === 'IndexToDirect') {
            indexBuffer = ColorNode.ColorIndex.a;
        }
        return {
            dataSize: 4,
            buffer: buffer,
            indices: indexBuffer,
            mappingType: mappingType,
            referenceType: referenceType
        };
    }
    parseMaterialIndices(MaterialNode) {
        const mappingType = MaterialNode.MappingInformationType;
        const referenceType = MaterialNode.ReferenceInformationType;
        if (mappingType === 'NoMappingInformation') {
            return {
                dataSize: 1,
                buffer: [0],
                indices: [0],
                mappingType: 'AllSame',
                referenceType: referenceType
            };
        }
        const materialIndexBuffer = MaterialNode.Materials.a;
        const materialIndices = [];
        for (let i = 0; i < materialIndexBuffer.length; ++i) {
            materialIndices.push(i);
        }
        return {
            dataSize: 1,
            buffer: materialIndexBuffer,
            indices: materialIndices,
            mappingType: mappingType,
            referenceType: referenceType
        };
    }
    parseNurbsGeometry(geoNode) {
        if (NURBSCurve === undefined) {
            console.error('THREE.FBXLoader: The loader relies on NURBSCurve for any nurbs present in the model. Nurbs will show up as empty geometry.');
            return new BufferGeometry();
        }
        const order = parseInt(geoNode.Order);
        if (isNaN(order)) {
            console.error('THREE.FBXLoader: Invalid Order %s given for geometry ID: %s', geoNode.Order, geoNode.id);
            return new BufferGeometry();
        }
        const degree = order - 1;
        const knots = geoNode.KnotVector.a;
        const controlPoints = [];
        const pointsValues = geoNode.Points.a;
        for (let i = 0, l = pointsValues.length; i < l; i += 4) {
            controlPoints.push(new Vector4().fromArray(pointsValues, i));
        }
        let startKnot, endKnot;
        if (geoNode.Form === 'Closed') {
            controlPoints.push(controlPoints[0]);
        }
        else if (geoNode.Form === 'Periodic') {
            startKnot = degree;
            endKnot = knots.length - 1 - startKnot;
            for (let i = 0; i < degree; ++i) {
                controlPoints.push(controlPoints[i]);
            }
        }
        const curve = new NURBSCurve(degree, knots, controlPoints, startKnot, endKnot);
        const points = curve.getPoints(controlPoints.length * 12);
        return new BufferGeometry().setFromPoints(points);
    }
}
class AnimationParser {
    parse() {
        const animationClips = [];
        const rawClips = this.parseClips();
        if (rawClips !== undefined) {
            for (const key in rawClips) {
                const rawClip = rawClips[key];
                const clip = this.addClip(rawClip);
                animationClips.push(clip);
            }
        }
        return animationClips;
    }
    parseClips() {
        if (fbxTree.Objects.AnimationCurve === undefined)
            return undefined;
        const curveNodesMap = this.parseAnimationCurveNodes();
        this.parseAnimationCurves(curveNodesMap);
        const layersMap = this.parseAnimationLayers(curveNodesMap);
        const rawClips = this.parseAnimStacks(layersMap);
        return rawClips;
    }
    parseAnimationCurveNodes() {
        const rawCurveNodes = fbxTree.Objects.AnimationCurveNode;
        const curveNodesMap = new Map();
        for (const nodeID in rawCurveNodes) {
            const rawCurveNode = rawCurveNodes[nodeID];
            if (rawCurveNode.attrName.match(/S|R|T|DeformPercent/) !== null) {
                const curveNode = {
                    id: rawCurveNode.id,
                    attr: rawCurveNode.attrName,
                    curves: {},
                };
                curveNodesMap.set(curveNode.id, curveNode);
            }
        }
        return curveNodesMap;
    }
    parseAnimationCurves(curveNodesMap) {
        const rawCurves = fbxTree.Objects.AnimationCurve;
        for (const nodeID in rawCurves) {
            const animationCurve = {
                id: rawCurves[nodeID].id,
                times: rawCurves[nodeID].KeyTime.a.map(convertFBXTimeToSeconds),
                values: rawCurves[nodeID].KeyValueFloat.a,
            };
            const relationships = connections.get(animationCurve.id);
            if (relationships !== undefined) {
                const animationCurveID = relationships.parents[0].ID;
                const animationCurveRelationship = relationships.parents[0].relationship;
                if (animationCurveRelationship.match(/X/)) {
                    curveNodesMap.get(animationCurveID).curves['x'] = animationCurve;
                }
                else if (animationCurveRelationship.match(/Y/)) {
                    curveNodesMap.get(animationCurveID).curves['y'] = animationCurve;
                }
                else if (animationCurveRelationship.match(/Z/)) {
                    curveNodesMap.get(animationCurveID).curves['z'] = animationCurve;
                }
                else if (animationCurveRelationship.match(/d|DeformPercent/) && curveNodesMap.has(animationCurveID)) {
                    curveNodesMap.get(animationCurveID).curves['morph'] = animationCurve;
                }
            }
        }
    }
    parseAnimationLayers(curveNodesMap) {
        const rawLayers = fbxTree.Objects.AnimationLayer;
        const layersMap = new Map();
        for (const nodeID in rawLayers) {
            const layerCurveNodes = [];
            const connection = connections.get(parseInt(nodeID));
            if (connection !== undefined) {
                const children = connection.children;
                children.forEach(function (child, i) {
                    if (curveNodesMap.has(child.ID)) {
                        const curveNode = curveNodesMap.get(child.ID);
                        if (curveNode.curves.x !== undefined || curveNode.curves.y !== undefined || curveNode.curves.z !== undefined) {
                            if (layerCurveNodes[i] === undefined) {
                                const modelID = connections.get(child.ID).parents.filter(function (parent) {
                                    return parent.relationship !== undefined;
                                })[0].ID;
                                if (modelID !== undefined) {
                                    const rawModel = fbxTree.Objects.Model[modelID.toString()];
                                    if (rawModel === undefined) {
                                        console.warn('THREE.FBXLoader: Encountered a unused curve.', child);
                                        return;
                                    }
                                    const node = {
                                        modelName: rawModel.attrName ? PropertyBinding.sanitizeNodeName(rawModel.attrName) : '',
                                        ID: rawModel.id,
                                        initialPosition: [0, 0, 0],
                                        initialRotation: [0, 0, 0],
                                        initialScale: [1, 1, 1],
                                    };
                                    sceneGraph.traverse(function (child) {
                                        if (child.ID === rawModel.id) {
                                            node.transform = child.matrix;
                                            if (child.userData.transformData)
                                                node.eulerOrder = child.userData.transformData.eulerOrder;
                                        }
                                    });
                                    if (!node.transform)
                                        node.transform = new Matrix4();
                                    if ('PreRotation' in rawModel)
                                        node.preRotation = rawModel.PreRotation.value;
                                    if ('PostRotation' in rawModel)
                                        node.postRotation = rawModel.PostRotation.value;
                                    layerCurveNodes[i] = node;
                                }
                            }
                            if (layerCurveNodes[i])
                                layerCurveNodes[i][curveNode.attr] = curveNode;
                        }
                        else if (curveNode.curves.morph !== undefined) {
                            if (layerCurveNodes[i] === undefined) {
                                const deformerID = connections.get(child.ID).parents.filter(function (parent) {
                                    return parent.relationship !== undefined;
                                })[0].ID;
                                const morpherID = connections.get(deformerID).parents[0].ID;
                                const geoID = connections.get(morpherID).parents[0].ID;
                                const modelID = connections.get(geoID).parents[0].ID;
                                const rawModel = fbxTree.Objects.Model[modelID];
                                const node = {
                                    modelName: rawModel.attrName ? PropertyBinding.sanitizeNodeName(rawModel.attrName) : '',
                                    morphName: fbxTree.Objects.Deformer[deformerID].attrName,
                                };
                                layerCurveNodes[i] = node;
                            }
                            layerCurveNodes[i][curveNode.attr] = curveNode;
                        }
                    }
                });
                layersMap.set(parseInt(nodeID), layerCurveNodes);
            }
        }
        return layersMap;
    }
    parseAnimStacks(layersMap) {
        const rawStacks = fbxTree.Objects.AnimationStack;
        const rawClips = {};
        for (const nodeID in rawStacks) {
            const children = connections.get(parseInt(nodeID)).children;
            if (children.length > 1) {
                console.warn('THREE.FBXLoader: Encountered an animation stack with multiple layers, this is currently not supported. Ignoring subsequent layers.');
            }
            const layer = layersMap.get(children[0].ID);
            rawClips[nodeID] = {
                name: rawStacks[nodeID].attrName,
                layer: layer,
            };
        }
        return rawClips;
    }
    addClip(rawClip) {
        let tracks = [];
        const scope = this;
        rawClip.layer.forEach(function (rawTracks) {
            tracks = tracks.concat(scope.generateTracks(rawTracks));
        });
        return new AnimationClip(rawClip.name, -1, tracks);
    }
    generateTracks(rawTracks) {
        const tracks = [];
        let initialPosition = new Vector3();
        let initialRotation = new Quaternion();
        let initialScale = new Vector3();
        if (rawTracks.transform)
            rawTracks.transform.decompose(initialPosition, initialRotation, initialScale);
        initialPosition = initialPosition.toArray();
        initialRotation = new Euler().setFromQuaternion(initialRotation, rawTracks.eulerOrder).toArray();
        initialScale = initialScale.toArray();
        if (rawTracks.T !== undefined && Object.keys(rawTracks.T.curves).length > 0) {
            const positionTrack = this.generateVectorTrack(rawTracks.modelName, rawTracks.T.curves, initialPosition, 'position');
            if (positionTrack !== undefined)
                tracks.push(positionTrack);
        }
        if (rawTracks.R !== undefined && Object.keys(rawTracks.R.curves).length > 0) {
            const rotationTrack = this.generateRotationTrack(rawTracks.modelName, rawTracks.R.curves, initialRotation, rawTracks.preRotation, rawTracks.postRotation, rawTracks.eulerOrder);
            if (rotationTrack !== undefined)
                tracks.push(rotationTrack);
        }
        if (rawTracks.S !== undefined && Object.keys(rawTracks.S.curves).length > 0) {
            const scaleTrack = this.generateVectorTrack(rawTracks.modelName, rawTracks.S.curves, initialScale, 'scale');
            if (scaleTrack !== undefined)
                tracks.push(scaleTrack);
        }
        if (rawTracks.DeformPercent !== undefined) {
            const morphTrack = this.generateMorphTrack(rawTracks);
            if (morphTrack !== undefined)
                tracks.push(morphTrack);
        }
        return tracks;
    }
    generateVectorTrack(modelName, curves, initialValue, type) {
        const times = this.getTimesForAllAxes(curves);
        const values = this.getKeyframeTrackValues(times, curves, initialValue);
        return new VectorKeyframeTrack(modelName + '.' + type, times, values);
    }
    generateRotationTrack(modelName, curves, initialValue, preRotation, postRotation, eulerOrder) {
        if (curves.x !== undefined) {
            this.interpolateRotations(curves.x);
            curves.x.values = curves.x.values.map(MathUtils.degToRad);
        }
        if (curves.y !== undefined) {
            this.interpolateRotations(curves.y);
            curves.y.values = curves.y.values.map(MathUtils.degToRad);
        }
        if (curves.z !== undefined) {
            this.interpolateRotations(curves.z);
            curves.z.values = curves.z.values.map(MathUtils.degToRad);
        }
        const times = this.getTimesForAllAxes(curves);
        const values = this.getKeyframeTrackValues(times, curves, initialValue);
        if (preRotation !== undefined) {
            preRotation = preRotation.map(MathUtils.degToRad);
            preRotation.push(eulerOrder);
            preRotation = new Euler().fromArray(preRotation);
            preRotation = new Quaternion().setFromEuler(preRotation);
        }
        if (postRotation !== undefined) {
            postRotation = postRotation.map(MathUtils.degToRad);
            postRotation.push(eulerOrder);
            postRotation = new Euler().fromArray(postRotation);
            postRotation = new Quaternion().setFromEuler(postRotation).invert();
        }
        const quaternion = new Quaternion();
        const euler = new Euler();
        const quaternionValues = [];
        for (let i = 0; i < values.length; i += 3) {
            euler.set(values[i], values[i + 1], values[i + 2], eulerOrder);
            quaternion.setFromEuler(euler);
            if (preRotation !== undefined)
                quaternion.premultiply(preRotation);
            if (postRotation !== undefined)
                quaternion.multiply(postRotation);
            quaternion.toArray(quaternionValues, (i / 3) * 4);
        }
        return new QuaternionKeyframeTrack(modelName + '.quaternion', times, quaternionValues);
    }
    generateMorphTrack(rawTracks) {
        const curves = rawTracks.DeformPercent.curves.morph;
        const values = curves.values.map(function (val) {
            return val / 100;
        });
        const morphNum = sceneGraph.getObjectByName(rawTracks.modelName).morphTargetDictionary[rawTracks.morphName];
        return new NumberKeyframeTrack(rawTracks.modelName + '.morphTargetInfluences[' + morphNum + ']', curves.times, values);
    }
    getTimesForAllAxes(curves) {
        let times = [];
        if (curves.x !== undefined)
            times = times.concat(curves.x.times);
        if (curves.y !== undefined)
            times = times.concat(curves.y.times);
        if (curves.z !== undefined)
            times = times.concat(curves.z.times);
        times = times.sort(function (a, b) {
            return a - b;
        });
        if (times.length > 1) {
            let targetIndex = 1;
            let lastValue = times[0];
            for (let i = 1; i < times.length; i++) {
                const currentValue = times[i];
                if (currentValue !== lastValue) {
                    times[targetIndex] = currentValue;
                    lastValue = currentValue;
                    targetIndex++;
                }
            }
            times = times.slice(0, targetIndex);
        }
        return times;
    }
    getKeyframeTrackValues(times, curves, initialValue) {
        const prevValue = initialValue;
        const values = [];
        let xIndex = -1;
        let yIndex = -1;
        let zIndex = -1;
        times.forEach(function (time) {
            if (curves.x)
                xIndex = curves.x.times.indexOf(time);
            if (curves.y)
                yIndex = curves.y.times.indexOf(time);
            if (curves.z)
                zIndex = curves.z.times.indexOf(time);
            if (xIndex !== -1) {
                const xValue = curves.x.values[xIndex];
                values.push(xValue);
                prevValue[0] = xValue;
            }
            else {
                values.push(prevValue[0]);
            }
            if (yIndex !== -1) {
                const yValue = curves.y.values[yIndex];
                values.push(yValue);
                prevValue[1] = yValue;
            }
            else {
                values.push(prevValue[1]);
            }
            if (zIndex !== -1) {
                const zValue = curves.z.values[zIndex];
                values.push(zValue);
                prevValue[2] = zValue;
            }
            else {
                values.push(prevValue[2]);
            }
        });
        return values;
    }
    interpolateRotations(curve) {
        for (let i = 1; i < curve.values.length; i++) {
            const initialValue = curve.values[i - 1];
            const valuesSpan = curve.values[i] - initialValue;
            const absoluteSpan = Math.abs(valuesSpan);
            if (absoluteSpan >= 180) {
                const numSubIntervals = absoluteSpan / 180;
                const step = valuesSpan / numSubIntervals;
                let nextValue = initialValue + step;
                const initialTime = curve.times[i - 1];
                const timeSpan = curve.times[i] - initialTime;
                const interval = timeSpan / numSubIntervals;
                let nextTime = initialTime + interval;
                const interpolatedTimes = [];
                const interpolatedValues = [];
                while (nextTime < curve.times[i]) {
                    interpolatedTimes.push(nextTime);
                    nextTime += interval;
                    interpolatedValues.push(nextValue);
                    nextValue += step;
                }
                curve.times = inject(curve.times, i, interpolatedTimes);
                curve.values = inject(curve.values, i, interpolatedValues);
            }
        }
    }
}
class TextParser {
    getPrevNode() {
        return this.nodeStack[this.currentIndent - 2];
    }
    getCurrentNode() {
        return this.nodeStack[this.currentIndent - 1];
    }
    getCurrentProp() {
        return this.currentProp;
    }
    pushStack(node) {
        this.nodeStack.push(node);
        this.currentIndent += 1;
    }
    popStack() {
        this.nodeStack.pop();
        this.currentIndent -= 1;
    }
    setCurrentProp(val, name) {
        this.currentProp = val;
        this.currentPropName = name;
    }
    parse(text) {
        this.currentIndent = 0;
        this.allNodes = new FBXTree();
        this.nodeStack = [];
        this.currentProp = [];
        this.currentPropName = '';
        const scope = this;
        const split = text.split(/[\r\n]+/);
        split.forEach(function (line, i) {
            const matchComment = line.match(/^[\s\t]*;/);
            const matchEmpty = line.match(/^[\s\t]*$/);
            if (matchComment || matchEmpty)
                return;
            const matchBeginning = line.match('^\\t{' + scope.currentIndent + '}(\\w+):(.*){', '');
            const matchProperty = line.match('^\\t{' + (scope.currentIndent) + '}(\\w+):[\\s\\t\\r\\n](.*)');
            const matchEnd = line.match('^\\t{' + (scope.currentIndent - 1) + '}}');
            if (matchBeginning) {
                scope.parseNodeBegin(line, matchBeginning);
            }
            else if (matchProperty) {
                scope.parseNodeProperty(line, matchProperty, split[++i]);
            }
            else if (matchEnd) {
                scope.popStack();
            }
            else if (line.match(/^[^\s\t}]/)) {
                scope.parseNodePropertyContinued(line);
            }
        });
        return this.allNodes;
    }
    parseNodeBegin(line, property) {
        const nodeName = property[1].trim().replace(/^"/, '').replace(/"$/, '');
        const nodeAttrs = property[2].split(',').map(function (attr) {
            return attr.trim().replace(/^"/, '').replace(/"$/, '');
        });
        const node = { name: nodeName };
        const attrs = this.parseNodeAttr(nodeAttrs);
        const currentNode = this.getCurrentNode();
        if (this.currentIndent === 0) {
            this.allNodes.add(nodeName, node);
        }
        else {
            if (nodeName in currentNode) {
                if (nodeName === 'PoseNode') {
                    currentNode.PoseNode.push(node);
                }
                else if (currentNode[nodeName].id !== undefined) {
                    currentNode[nodeName] = {};
                    currentNode[nodeName][currentNode[nodeName].id] = currentNode[nodeName];
                }
                if (attrs.id !== '')
                    currentNode[nodeName][attrs.id] = node;
            }
            else if (typeof attrs.id === 'number') {
                currentNode[nodeName] = {};
                currentNode[nodeName][attrs.id] = node;
            }
            else if (nodeName !== 'Properties70') {
                if (nodeName === 'PoseNode')
                    currentNode[nodeName] = [node];
                else
                    currentNode[nodeName] = node;
            }
        }
        if (typeof attrs.id === 'number')
            node.id = attrs.id;
        if (attrs.name !== '')
            node.attrName = attrs.name;
        if (attrs.type !== '')
            node.attrType = attrs.type;
        this.pushStack(node);
    }
    parseNodeAttr(attrs) {
        let id = attrs[0];
        if (attrs[0] !== '') {
            id = parseInt(attrs[0]);
            if (isNaN(id)) {
                id = attrs[0];
            }
        }
        let name = '', type = '';
        if (attrs.length > 1) {
            name = attrs[1].replace(/^(\w+)::/, '');
            type = attrs[2];
        }
        return { id: id, name: name, type: type };
    }
    parseNodeProperty(line, property, contentLine) {
        let propName = property[1].replace(/^"/, '').replace(/"$/, '').trim();
        let propValue = property[2].replace(/^"/, '').replace(/"$/, '').trim();
        if (propName === 'Content' && propValue === ',') {
            propValue = contentLine.replace(/"/g, '').replace(/,$/, '').trim();
        }
        const currentNode = this.getCurrentNode();
        const parentName = currentNode.name;
        if (parentName === 'Properties70') {
            this.parseNodeSpecialProperty(line, propName, propValue);
            return;
        }
        if (propName === 'C') {
            const connProps = propValue.split(',').slice(1);
            const from = parseInt(connProps[0]);
            const to = parseInt(connProps[1]);
            let rest = propValue.split(',').slice(3);
            rest = rest.map(function (elem) {
                return elem.trim().replace(/^"/, '');
            });
            propName = 'connections';
            propValue = [from, to];
            append(propValue, rest);
            if (currentNode[propName] === undefined) {
                currentNode[propName] = [];
            }
        }
        if (propName === 'Node')
            currentNode.id = propValue;
        if (propName in currentNode && Array.isArray(currentNode[propName])) {
            currentNode[propName].push(propValue);
        }
        else {
            if (propName !== 'a')
                currentNode[propName] = propValue;
            else
                currentNode.a = propValue;
        }
        this.setCurrentProp(currentNode, propName);
        if (propName === 'a' && propValue.slice(-1) !== ',') {
            currentNode.a = parseNumberArray(propValue);
        }
    }
    parseNodePropertyContinued(line) {
        const currentNode = this.getCurrentNode();
        currentNode.a += line;
        if (line.slice(-1) !== ',') {
            currentNode.a = parseNumberArray(currentNode.a);
        }
    }
    parseNodeSpecialProperty(line, propName, propValue) {
        const props = propValue.split('",').map(function (prop) {
            return prop.trim().replace(/^\"/, '').replace(/\s/, '_');
        });
        const innerPropName = props[0];
        const innerPropType1 = props[1];
        const innerPropType2 = props[2];
        const innerPropFlag = props[3];
        let innerPropValue = props[4];
        switch (innerPropType1) {
            case 'int':
            case 'enum':
            case 'bool':
            case 'ULongLong':
            case 'double':
            case 'Number':
            case 'FieldOfView':
                innerPropValue = parseFloat(innerPropValue);
                break;
            case 'Color':
            case 'ColorRGB':
            case 'Vector3D':
            case 'Lcl_Translation':
            case 'Lcl_Rotation':
            case 'Lcl_Scaling':
                innerPropValue = parseNumberArray(innerPropValue);
                break;
        }
        this.getPrevNode()[innerPropName] = {
            'type': innerPropType1,
            'type2': innerPropType2,
            'flag': innerPropFlag,
            'value': innerPropValue
        };
        this.setCurrentProp(this.getPrevNode(), innerPropName);
    }
}
class BinaryParser {
    parse(buffer) {
        const reader = new BinaryReader(buffer);
        reader.skip(23);
        const version = reader.getUint32();
        if (version < 6400) {
            throw new Error('THREE.FBXLoader: FBX version not supported, FileVersion: ' + version);
        }
        const allNodes = new FBXTree();
        while (!this.endOfContent(reader)) {
            const node = this.parseNode(reader, version);
            if (node !== null)
                allNodes.add(node.name, node);
        }
        return allNodes;
    }
    endOfContent(reader) {
        if (reader.size() % 16 === 0) {
            return ((reader.getOffset() + 160 + 16) & ~0xf) >= reader.size();
        }
        else {
            return reader.getOffset() + 160 + 16 >= reader.size();
        }
    }
    parseNode(reader, version) {
        const node = {};
        const endOffset = (version >= 7500) ? reader.getUint64() : reader.getUint32();
        const numProperties = (version >= 7500) ? reader.getUint64() : reader.getUint32();
        (version >= 7500) ? reader.getUint64() : reader.getUint32();
        const nameLen = reader.getUint8();
        const name = reader.getString(nameLen);
        if (endOffset === 0)
            return null;
        const propertyList = [];
        for (let i = 0; i < numProperties; i++) {
            propertyList.push(this.parseProperty(reader));
        }
        const id = propertyList.length > 0 ? propertyList[0] : '';
        const attrName = propertyList.length > 1 ? propertyList[1] : '';
        const attrType = propertyList.length > 2 ? propertyList[2] : '';
        node.singleProperty = (numProperties === 1 && reader.getOffset() === endOffset) ? true : false;
        while (endOffset > reader.getOffset()) {
            const subNode = this.parseNode(reader, version);
            if (subNode !== null)
                this.parseSubNode(name, node, subNode);
        }
        node.propertyList = propertyList;
        if (typeof id === 'number')
            node.id = id;
        if (attrName !== '')
            node.attrName = attrName;
        if (attrType !== '')
            node.attrType = attrType;
        if (name !== '')
            node.name = name;
        return node;
    }
    parseSubNode(name, node, subNode) {
        if (subNode.singleProperty === true) {
            const value = subNode.propertyList[0];
            if (Array.isArray(value)) {
                node[subNode.name] = subNode;
                subNode.a = value;
            }
            else {
                node[subNode.name] = value;
            }
        }
        else if (name === 'Connections' && subNode.name === 'C') {
            const array = [];
            subNode.propertyList.forEach(function (property, i) {
                if (i !== 0)
                    array.push(property);
            });
            if (node.connections === undefined) {
                node.connections = [];
            }
            node.connections.push(array);
        }
        else if (subNode.name === 'Properties70') {
            const keys = Object.keys(subNode);
            keys.forEach(function (key) {
                node[key] = subNode[key];
            });
        }
        else if (name === 'Properties70' && subNode.name === 'P') {
            let innerPropName = subNode.propertyList[0];
            let innerPropType1 = subNode.propertyList[1];
            const innerPropType2 = subNode.propertyList[2];
            const innerPropFlag = subNode.propertyList[3];
            let innerPropValue;
            if (innerPropName.indexOf('Lcl ') === 0)
                innerPropName = innerPropName.replace('Lcl ', 'Lcl_');
            if (innerPropType1.indexOf('Lcl ') === 0)
                innerPropType1 = innerPropType1.replace('Lcl ', 'Lcl_');
            if (innerPropType1 === 'Color' || innerPropType1 === 'ColorRGB' || innerPropType1 === 'Vector' || innerPropType1 === 'Vector3D' || innerPropType1.indexOf('Lcl_') === 0) {
                innerPropValue = [
                    subNode.propertyList[4],
                    subNode.propertyList[5],
                    subNode.propertyList[6]
                ];
            }
            else {
                innerPropValue = subNode.propertyList[4];
            }
            node[innerPropName] = {
                'type': innerPropType1,
                'type2': innerPropType2,
                'flag': innerPropFlag,
                'value': innerPropValue
            };
        }
        else if (node[subNode.name] === undefined) {
            if (typeof subNode.id === 'number') {
                node[subNode.name] = {};
                node[subNode.name][subNode.id] = subNode;
            }
            else {
                node[subNode.name] = subNode;
            }
        }
        else {
            if (subNode.name === 'PoseNode') {
                if (!Array.isArray(node[subNode.name])) {
                    node[subNode.name] = [node[subNode.name]];
                }
                node[subNode.name].push(subNode);
            }
            else if (node[subNode.name][subNode.id] === undefined) {
                node[subNode.name][subNode.id] = subNode;
            }
        }
    }
    parseProperty(reader) {
        const type = reader.getString(1);
        let length;
        switch (type) {
            case 'C':
                return reader.getBoolean();
            case 'D':
                return reader.getFloat64();
            case 'F':
                return reader.getFloat32();
            case 'I':
                return reader.getInt32();
            case 'L':
                return reader.getInt64();
            case 'R':
                length = reader.getUint32();
                return reader.getArrayBuffer(length);
            case 'S':
                length = reader.getUint32();
                return reader.getString(length);
            case 'Y':
                return reader.getInt16();
            case 'b':
            case 'c':
            case 'd':
            case 'f':
            case 'i':
            case 'l':
                const arrayLength = reader.getUint32();
                const encoding = reader.getUint32();
                const compressedLength = reader.getUint32();
                if (encoding === 0) {
                    switch (type) {
                        case 'b':
                        case 'c':
                            return reader.getBooleanArray(arrayLength);
                        case 'd':
                            return reader.getFloat64Array(arrayLength);
                        case 'f':
                            return reader.getFloat32Array(arrayLength);
                        case 'i':
                            return reader.getInt32Array(arrayLength);
                        case 'l':
                            return reader.getInt64Array(arrayLength);
                    }
                }
                if (typeof fflate === 'undefined') {
                    console.error('THREE.FBXLoader: External library fflate.min.js required.');
                }
                const data = fflate.unzlibSync(new Uint8Array(reader.getArrayBuffer(compressedLength)));
                const reader2 = new BinaryReader(data.buffer);
                switch (type) {
                    case 'b':
                    case 'c':
                        return reader2.getBooleanArray(arrayLength);
                    case 'd':
                        return reader2.getFloat64Array(arrayLength);
                    case 'f':
                        return reader2.getFloat32Array(arrayLength);
                    case 'i':
                        return reader2.getInt32Array(arrayLength);
                    case 'l':
                        return reader2.getInt64Array(arrayLength);
                }
            default:
                throw new Error('THREE.FBXLoader: Unknown property type ' + type);
        }
    }
}
class BinaryReader {
    constructor(buffer, littleEndian) {
        this.dv = new DataView(buffer);
        this.offset = 0;
        this.littleEndian = (littleEndian !== undefined) ? littleEndian : true;
    }
    getOffset() {
        return this.offset;
    }
    size() {
        return this.dv.buffer.byteLength;
    }
    skip(length) {
        this.offset += length;
    }
    getBoolean() {
        return (this.getUint8() & 1) === 1;
    }
    getBooleanArray(size) {
        const a = [];
        for (let i = 0; i < size; i++) {
            a.push(this.getBoolean());
        }
        return a;
    }
    getUint8() {
        const value = this.dv.getUint8(this.offset);
        this.offset += 1;
        return value;
    }
    getInt16() {
        const value = this.dv.getInt16(this.offset, this.littleEndian);
        this.offset += 2;
        return value;
    }
    getInt32() {
        const value = this.dv.getInt32(this.offset, this.littleEndian);
        this.offset += 4;
        return value;
    }
    getInt32Array(size) {
        const a = [];
        for (let i = 0; i < size; i++) {
            a.push(this.getInt32());
        }
        return a;
    }
    getUint32() {
        const value = this.dv.getUint32(this.offset, this.littleEndian);
        this.offset += 4;
        return value;
    }
    getInt64() {
        let low, high;
        if (this.littleEndian) {
            low = this.getUint32();
            high = this.getUint32();
        }
        else {
            high = this.getUint32();
            low = this.getUint32();
        }
        if (high & 0x80000000) {
            high = ~high & 0xFFFFFFFF;
            low = ~low & 0xFFFFFFFF;
            if (low === 0xFFFFFFFF)
                high = (high + 1) & 0xFFFFFFFF;
            low = (low + 1) & 0xFFFFFFFF;
            return -(high * 0x100000000 + low);
        }
        return high * 0x100000000 + low;
    }
    getInt64Array(size) {
        const a = [];
        for (let i = 0; i < size; i++) {
            a.push(this.getInt64());
        }
        return a;
    }
    getUint64() {
        let low, high;
        if (this.littleEndian) {
            low = this.getUint32();
            high = this.getUint32();
        }
        else {
            high = this.getUint32();
            low = this.getUint32();
        }
        return high * 0x100000000 + low;
    }
    getFloat32() {
        const value = this.dv.getFloat32(this.offset, this.littleEndian);
        this.offset += 4;
        return value;
    }
    getFloat32Array(size) {
        const a = [];
        for (let i = 0; i < size; i++) {
            a.push(this.getFloat32());
        }
        return a;
    }
    getFloat64() {
        const value = this.dv.getFloat64(this.offset, this.littleEndian);
        this.offset += 8;
        return value;
    }
    getFloat64Array(size) {
        const a = [];
        for (let i = 0; i < size; i++) {
            a.push(this.getFloat64());
        }
        return a;
    }
    getArrayBuffer(size) {
        const value = this.dv.buffer.slice(this.offset, this.offset + size);
        this.offset += size;
        return value;
    }
    getString(size) {
        let a = [];
        for (let i = 0; i < size; i++) {
            a[i] = this.getUint8();
        }
        const nullByte = a.indexOf(0);
        if (nullByte >= 0)
            a = a.slice(0, nullByte);
        return LoaderUtils.decodeText(new Uint8Array(a));
    }
}
class FBXTree {
    add(key, val) {
        this[key] = val;
    }
}
function isFbxFormatBinary(buffer) {
    const CORRECT = 'Kaydara\u0020FBX\u0020Binary\u0020\u0020\0';
    return buffer.byteLength >= CORRECT.length && CORRECT === convertArrayBufferToString(buffer, 0, CORRECT.length);
}
function isFbxFormatASCII(text) {
    const CORRECT = ['K', 'a', 'y', 'd', 'a', 'r', 'a', '\\', 'F', 'B', 'X', '\\', 'B', 'i', 'n', 'a', 'r', 'y', '\\', '\\'];
    let cursor = 0;
    function read(offset) {
        const result = text[offset - 1];
        text = text.slice(cursor + offset);
        cursor++;
        return result;
    }
    for (let i = 0; i < CORRECT.length; ++i) {
        const num = read(1);
        if (num === CORRECT[i]) {
            return false;
        }
    }
    return true;
}
function getFbxVersion(text) {
    const versionRegExp = /FBXVersion: (\d+)/;
    const match = text.match(versionRegExp);
    if (match) {
        const version = parseInt(match[1]);
        return version;
    }
    throw new Error('THREE.FBXLoader: Cannot find the version number for the file given.');
}
function convertFBXTimeToSeconds(time) {
    return time / 46186158000;
}
const dataArray = [];
function getData(polygonVertexIndex, polygonIndex, vertexIndex, infoObject) {
    let index;
    switch (infoObject.mappingType) {
        case 'ByPolygonVertex':
            index = polygonVertexIndex;
            break;
        case 'ByPolygon':
            index = polygonIndex;
            break;
        case 'ByVertice':
            index = vertexIndex;
            break;
        case 'AllSame':
            index = infoObject.indices[0];
            break;
        default:
            console.warn('THREE.FBXLoader: unknown attribute mapping type ' + infoObject.mappingType);
    }
    if (infoObject.referenceType === 'IndexToDirect')
        index = infoObject.indices[index];
    const from = index * infoObject.dataSize;
    const to = from + infoObject.dataSize;
    return slice(dataArray, infoObject.buffer, from, to);
}
const tempEuler = new Euler();
const tempVec = new Vector3();
function generateTransform(transformData) {
    const lTranslationM = new Matrix4();
    const lPreRotationM = new Matrix4();
    const lRotationM = new Matrix4();
    const lPostRotationM = new Matrix4();
    const lScalingM = new Matrix4();
    const lScalingPivotM = new Matrix4();
    const lScalingOffsetM = new Matrix4();
    const lRotationOffsetM = new Matrix4();
    const lRotationPivotM = new Matrix4();
    const lParentGX = new Matrix4();
    const lParentLX = new Matrix4();
    const lGlobalT = new Matrix4();
    const inheritType = (transformData.inheritType) ? transformData.inheritType : 0;
    if (transformData.translation)
        lTranslationM.setPosition(tempVec.fromArray(transformData.translation));
    if (transformData.preRotation) {
        const array = transformData.preRotation.map(MathUtils.degToRad);
        array.push(transformData.eulerOrder);
        lPreRotationM.makeRotationFromEuler(tempEuler.fromArray(array));
    }
    if (transformData.rotation) {
        const array = transformData.rotation.map(MathUtils.degToRad);
        array.push(transformData.eulerOrder);
        lRotationM.makeRotationFromEuler(tempEuler.fromArray(array));
    }
    if (transformData.postRotation) {
        const array = transformData.postRotation.map(MathUtils.degToRad);
        array.push(transformData.eulerOrder);
        lPostRotationM.makeRotationFromEuler(tempEuler.fromArray(array));
        lPostRotationM.invert();
    }
    if (transformData.scale)
        lScalingM.scale(tempVec.fromArray(transformData.scale));
    if (transformData.scalingOffset)
        lScalingOffsetM.setPosition(tempVec.fromArray(transformData.scalingOffset));
    if (transformData.scalingPivot)
        lScalingPivotM.setPosition(tempVec.fromArray(transformData.scalingPivot));
    if (transformData.rotationOffset)
        lRotationOffsetM.setPosition(tempVec.fromArray(transformData.rotationOffset));
    if (transformData.rotationPivot)
        lRotationPivotM.setPosition(tempVec.fromArray(transformData.rotationPivot));
    if (transformData.parentMatrixWorld) {
        lParentLX.copy(transformData.parentMatrix);
        lParentGX.copy(transformData.parentMatrixWorld);
    }
    const lLRM = lPreRotationM.clone().multiply(lRotationM).multiply(lPostRotationM);
    const lParentGRM = new Matrix4();
    lParentGRM.extractRotation(lParentGX);
    const lParentTM = new Matrix4();
    lParentTM.copyPosition(lParentGX);
    const lParentGRSM = lParentTM.clone().invert().multiply(lParentGX);
    const lParentGSM = lParentGRM.clone().invert().multiply(lParentGRSM);
    const lLSM = lScalingM;
    const lGlobalRS = new Matrix4();
    if (inheritType === 0) {
        lGlobalRS.copy(lParentGRM).multiply(lLRM).multiply(lParentGSM).multiply(lLSM);
    }
    else if (inheritType === 1) {
        lGlobalRS.copy(lParentGRM).multiply(lParentGSM).multiply(lLRM).multiply(lLSM);
    }
    else {
        const lParentLSM = new Matrix4().scale(new Vector3().setFromMatrixScale(lParentLX));
        const lParentLSM_inv = lParentLSM.clone().invert();
        const lParentGSM_noLocal = lParentGSM.clone().multiply(lParentLSM_inv);
        lGlobalRS.copy(lParentGRM).multiply(lLRM).multiply(lParentGSM_noLocal).multiply(lLSM);
    }
    const lRotationPivotM_inv = lRotationPivotM.clone().invert();
    const lScalingPivotM_inv = lScalingPivotM.clone().invert();
    let lTransform = lTranslationM.clone().multiply(lRotationOffsetM).multiply(lRotationPivotM).multiply(lPreRotationM).multiply(lRotationM).multiply(lPostRotationM).multiply(lRotationPivotM_inv).multiply(lScalingOffsetM).multiply(lScalingPivotM).multiply(lScalingM).multiply(lScalingPivotM_inv);
    const lLocalTWithAllPivotAndOffsetInfo = new Matrix4().copyPosition(lTransform);
    const lGlobalTranslation = lParentGX.clone().multiply(lLocalTWithAllPivotAndOffsetInfo);
    lGlobalT.copyPosition(lGlobalTranslation);
    lTransform = lGlobalT.clone().multiply(lGlobalRS);
    lTransform.premultiply(lParentGX.invert());
    return lTransform;
}
function getEulerOrder(order) {
    order = order || 0;
    const enums = [
        'ZYX',
        'YZX',
        'XZY',
        'ZXY',
        'YXZ',
        'XYZ',
    ];
    if (order === 6) {
        console.warn('THREE.FBXLoader: unsupported Euler Order: Spherical XYZ. Animations and rotations may be incorrect.');
        return enums[0];
    }
    return enums[order];
}
function parseNumberArray(value) {
    const array = value.split(',').map(function (val) {
        return parseFloat(val);
    });
    return array;
}
function convertArrayBufferToString(buffer, from, to) {
    if (from === undefined)
        from = 0;
    if (to === undefined)
        to = buffer.byteLength;
    return LoaderUtils.decodeText(new Uint8Array(buffer, from, to));
}
function append(a, b) {
    for (let i = 0, j = a.length, l = b.length; i < l; i++, j++) {
        a[j] = b[i];
    }
}
function slice(a, b, from, to) {
    for (let i = from, j = 0; i < to; i++, j++) {
        a[j] = b[i];
    }
    return a;
}
function inject(a1, index, a2) {
    return a1.slice(0, index).concat(a2).concat(a1.slice(index));
}
export { FBXLoader };
//# sourceMappingURL=FBXLoader.js.map
import { Scene as ThreeScene } from 'three/src/scenes/Scene.js';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer.js';
export class VisualLayers {
    __layers = [];
    __renderer;
    __Scene;
    constructor(renderer, Scene = ThreeScene) {
        this.__renderer = renderer;
        this.__Scene = Scene;
    }
    dispose() {
        this.__layers.length = 0;
    }
    defineLayer(layerName, order = 0) {
        const layer = this.__getOrMakeLayer(layerName);
        const previousOrder = layer.order;
        layer.order = order;
        if (previousOrder !== layer.order)
            this.__layers.sort((a, b) => a.order - b.order);
        return layer;
    }
    setLayerVisible(layerNames, visible) {
        if (typeof layerNames == 'string')
            return this.__setLayerVisible(layerNames, visible);
        for (const name of layerNames)
            this.__setLayerVisible(name, visible);
    }
    __setLayerVisible(layerName, visible) {
        const layer = this.__layers.find(l => l.name === layerName);
        if (!layer)
            throw new Error('Can not set visibility of layer that does not exist.');
        layer.visible = visible;
    }
    __getOrMakeLayer(layerName) {
        let layer = this.__layers.find(l => l.name === layerName);
        if (!layer) {
            layer = { name: layerName, backingScene: new this.__Scene(), order: 0, visible: true };
            layer.backingScene.autoUpdate = false;
            layer.backingScene.matrixWorldAutoUpdate = false;
            this.__layers.push(layer);
        }
        return layer;
    }
    removeLayer(layerName) {
        const index = this.__layers.findIndex(l => {
            if (l.name === layerName) {
                l.backingScene.children.length = 0;
                return true;
            }
            return false;
        });
        if (index >= 0)
            this.__layers.splice(index, 1);
    }
    hasLayer(layerName) {
        return this.__layers.some(l => l.name === layerName);
    }
    get layerCount() {
        return this.__layers.length;
    }
    addObjectToLayer(obj, layerNames, withSubtree = false) {
        if (typeof layerNames == 'string')
            return this.__addObjectToLayer(obj, layerNames, withSubtree);
        for (const name of layerNames)
            this.__addObjectToLayer(obj, name, withSubtree);
    }
    addObjectsToLayer(objects, layerNames, withSubtree = false) {
        for (const obj of objects)
            this.addObjectToLayer(obj, layerNames, withSubtree);
    }
    addObjectToAllLayers(obj, withSubtree = false) {
        for (const layer of this.__layers)
            this.__addObjectToLayer(obj, layer.name, withSubtree);
    }
    addObjectsToAllLayers(objects, withSubtree = false) {
        for (const obj of objects)
            this.addObjectToAllLayers(obj, withSubtree);
    }
    __emptyArray = Object.freeze([]);
    __addObjectToLayer(obj, layerName, withSubtree) {
        const layer = this.__getOrMakeLayer(layerName);
        if (!this.__layerHasObject(layer, obj)) {
            const proxy = Object.create(obj, withSubtree ? {} : { children: { get: () => this.__emptyArray } });
            layer.backingScene.children.push(proxy);
        }
    }
    __layerHasObject(layer, obj) {
        return layer.backingScene.children.some(proxy => proxy.__proto__ === obj);
    }
    removeObjectFromLayer(obj, layerNames) {
        if (typeof layerNames == 'string') {
            const layer = this.__layers.find(l => l.name === layerNames);
            return this.__removeObjectFromLayer(obj, layer);
        }
        for (const name of layerNames) {
            const layer = this.__layers.find(l => l.name === name);
            this.__removeObjectFromLayer(obj, layer);
        }
    }
    removeObjectsFromLayer(objects, layerNames) {
        for (const obj of objects)
            this.removeObjectFromLayer(obj, layerNames);
    }
    removeObjectFromAllLayers(obj) {
        for (const layer of this.__layers)
            this.__removeObjectFromLayer(obj, layer);
    }
    removeObjectsFromAllLayers(objects) {
        for (const obj of objects)
            this.removeObjectFromAllLayers(obj);
    }
    __removeObjectFromLayer(obj, layer) {
        if (!layer)
            throw new Error('Can not remove object from layer that does not exist.');
        const children = layer.backingScene.children;
        const index = children.findIndex(proxy => proxy.__proto__ === obj);
        if (index >= 0) {
            children[index] = children[children.length - 1];
            children.pop();
        }
    }
    render(camera, beforeAll = this.__defaultBeforeAllCallback, beforeEach = this.__defaultBeforeEachCallback, afterEach = this.__defaultAfterEachCallback) {
        beforeAll();
        for (const layer of this.__layers) {
            if (!layer.visible)
                continue;
            beforeEach(layer.name);
            this.__renderer.render(layer.backingScene, camera);
            afterEach(layer.name);
        }
    }
    __defaultBeforeAllCallback = () => {
        if (this.__renderer instanceof WebGLRenderer) {
            this.__renderer.autoClear = false;
            this.__renderer.clear();
        }
    };
    __defaultBeforeEachCallback = () => { };
    __defaultAfterEachCallback = () => {
        if (this.__renderer instanceof WebGLRenderer)
            this.__renderer.clearDepth();
    };
}
//# sourceMappingURL=VisualLayers.js.map
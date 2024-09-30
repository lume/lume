// Work started at https://discourse.threejs.org/t/12503/35
import { Scene as ThreeScene } from 'three/src/scenes/Scene.js';
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer.js';
/**
 * Allows rendering objects into one ore more visual layers that are stacked on
 * top of each other. Think of it like layers in Adobe Photoshop.
 */
export class VisualLayers {
    #layers = [];
    #renderer;
    #Scene;
    /**
     * @param {THREE.Renderer} renderer The `THREE.Renderer` (f.e. `THREE.WebGLRenderer`) that
     * will be used to render the layers.
     * @param {typeof THREE.Scene} Scene The `THREE.Scene` class that will be used for each layer
     * (one per layer). If not provided, `THREE.Scene` is used by default.
     */
    // IDEA: Optionally accept different Scene types per layer.
    constructor(renderer, Scene = ThreeScene) {
        this.#renderer = renderer;
        this.#Scene = Scene;
    }
    /**
     * Deletes all defined layers -- hence un-references contained objects so
     * they can be garbage collected -- as if starting with a fresh new
     * VisualLayers. Generally you should call this if you are getting rid
     * of layering, or want to define a new set of layers, etc.
     */
    dispose() {
        this.#layers.length = 0;
    }
    /**
     * Defines a new layer.
     * @param {LayerName} layerName The name to give the layer.
     * @param {number} order The order it will have. The newly-defined layer will
     * render above other layers that have lower numbers, and below other layers
     * that have higher order numbers.
     * @returns {Layer} The created object representing the layer.
     */
    defineLayer(layerName, order = 0) {
        const layer = this.#getOrMakeLayer(layerName);
        const previousOrder = layer.order;
        layer.order = order;
        // Sort only if order changed.
        if (previousOrder !== layer.order)
            this.#layers.sort((a, b) => a.order - b.order);
        return layer;
    }
    /**
     * Set the visibility of one or more layers.
     * @param {LayerNames} layerNames The name of a layer (or array of names of layers) that will have its (their) visibility set.
     * @param {boolean} visible A boolean indicating whether the layer or layers should be visible.
     */
    setLayerVisible(layerNames, visible) {
        if (typeof layerNames == 'string')
            return this.#setLayerVisible(layerNames, visible);
        for (const name of layerNames)
            this.#setLayerVisible(name, visible);
    }
    #setLayerVisible(layerName, visible) {
        const layer = this.#layers.find(l => l.name === layerName);
        if (!layer)
            throw new Error('Can not set visibility of layer that does not exist.');
        layer.visible = visible;
    }
    /** Get a layer by name (if it doesn't exist, creates it with default order 0). */
    #getOrMakeLayer(layerName) {
        let layer = this.#layers.find(l => l.name === layerName);
        if (!layer) {
            layer = { name: layerName, backingScene: new this.#Scene(), order: 0, visible: true };
            // @ts-expect-error legacy
            layer.backingScene.autoUpdate = false; // three <0.144
            layer.backingScene.matrixWorldAutoUpdate = false; // three >=0.144
            this.#layers.push(layer);
        }
        return layer;
    }
    /**
     * Remove a layer.
     * @param {LayerName} layerName The name of the layer to remove.
     */
    removeLayer(layerName) {
        const index = this.#layers.findIndex(l => {
            if (l.name === layerName) {
                l.backingScene.children.length = 0;
                return true;
            }
            return false;
        });
        if (index >= 0)
            this.#layers.splice(index, 1);
    }
    /**
     * Check if a layer exists.
     * @param {LayerName} layerName The name of the layer to check existence of.
     * @returns {boolean} A boolean indicating if the layer exists.
     */
    hasLayer(layerName) {
        return this.#layers.some(l => l.name === layerName);
    }
    /**
     * The number of layers.
     * @readonly
     * @type {number}
     */
    get layerCount() {
        return this.#layers.length;
    }
    /**
     * Add an object (anything that is or extends from THREE.Object3D) to the named layer (or named layers).
     *
     * @param {THREE.Object3D} obj The object to add. Must be an `instanceof THREE.Object3D`.
     *
     * @param {LayerNames} layerNames The name of a layer (or array of names of layers) that
     * the object will be added to. If an object is added to multiple layers, the
     * object will be rendered multiple times, once per layer.
     *
     * @param {boolean | undefined} withSubtree When true, this causes an object that was added into
     * specified layer(s) be rendered with its (grand)children, rather than it
     * being rendered only by itself without any of its (grand)children.
     *
     * It is useful for `withSubtree` to be set to `false` (the default) when you
     * want to have a hierarchy with different parts of the hierarchy rendered
     * in different layers
     *
     * On the other hand, sometimes you have a whole tree that you want to put in
     * a layer and don’t want to have to specify layers for all of the sub-nodes.
     * Set `withSubtree` to `true` in this case to add a root node to a layer
     * to render that whole subtree in that layer.
     *
     * It is easier to add a whole tree into a layer with `withSubtree` as
     * `true`. When `withSubtree` is `false` each node in a subtree would
     * need to be added to a layer manually, but this allows more fine grained control of
     * which parts of a tree will render in various layers.
     */
    addObjectToLayer(obj, layerNames, withSubtree = false) {
        if (typeof layerNames == 'string')
            return this.#addObjectToLayer(obj, layerNames, withSubtree);
        for (const name of layerNames)
            this.#addObjectToLayer(obj, name, withSubtree);
    }
    /**
     * Similar to `addObjectToLayer`, but for adding multiple objects at once.
     * @param {THREE.Object3D[]} objects An array of objects that are `instanceof THREE.Object3D`.
     * @param {LayerNames} layerNames The layer or layers to add the objects to.
     * @param {boolean | undefined} withSubtree Whether rendering of the objects will also render their
     * children. See `withSubtree` of `addObjectToLayer` for more details.
     */
    addObjectsToLayer(objects, layerNames, withSubtree = false) {
        for (const obj of objects)
            this.addObjectToLayer(obj, layerNames, withSubtree);
    }
    /**
     * Add an object to all currently-defined layers.
     * @param {THREE.Object3D} obj The object to add. Must be an `instanceof THREE.Object3D`.
     * @param {boolean | undefined} withSubtree Whether rendering of the object will also render its
     * children. See `withSubtree` of `addObjectToLayer` for more details.
     */
    addObjectToAllLayers(obj, withSubtree = false) {
        for (const layer of this.#layers)
            this.#addObjectToLayer(obj, layer.name, withSubtree);
    }
    /**
     * Add a set of objects to all currently-defined layers.
     * @param {THREE.Object3D[]} objects The list of `THREE.Object3D` instances to add.
     * @param {boolean | undefined} withSubtree Whether rendering of the objects will also render their
     * children. See `withSubtree` of `addObjectToLayer` for more details.
     */
    addObjectsToAllLayers(objects, withSubtree = false) {
        for (const obj of objects)
            this.addObjectToAllLayers(obj, withSubtree);
    }
    #emptyArray = Object.freeze([]);
    #addObjectToLayer(obj, layerName, withSubtree) {
        const layer = this.#getOrMakeLayer(layerName);
        if (!this.#layerHasObject(layer, obj)) {
            const proxy = Object.create(obj, withSubtree ? {} : { children: { get: () => this.#emptyArray } });
            // We use `children.push()` here instead of `children.add()` so that the
            // added child will not be removed from its parent in its original scene.
            // This allows us to add an object to multiple layers, and to not
            // interfere with the user's original tree.
            layer.backingScene.children.push(proxy);
        }
    }
    #layerHasObject(layer, obj) {
        return layer.backingScene.children.some(proxy => proxy.__proto__ === obj);
    }
    /**
     * Remove an object from a layer or set of layers.
     * @param {THREE.Object3D} obj The object to remove from the specified layer or layers.
     * @param {LayerNames} layerNames The layer or layers from which to remove the object from.
     */
    removeObjectFromLayer(obj, layerNames) {
        if (typeof layerNames == 'string') {
            const layer = this.#layers.find(l => l.name === layerNames);
            return this.#removeObjectFromLayer(obj, layer);
        }
        for (const name of layerNames) {
            const layer = this.#layers.find(l => l.name === name);
            this.#removeObjectFromLayer(obj, layer);
        }
    }
    /**
     * Remove an object from a layer or set of layers.
     * @param {THREE.Object3D[]} objects The objects to remove from the specified layer or layers.
     * @param {LayerNames} layerNames The layer or layers from which to remove the object from.
     */
    removeObjectsFromLayer(objects, layerNames) {
        for (const obj of objects)
            this.removeObjectFromLayer(obj, layerNames);
    }
    /**
     * Remove the given object from all layers.
     * @param {THREE.Object3D} obj The object to remove.
     */
    removeObjectFromAllLayers(obj) {
        for (const layer of this.#layers)
            this.#removeObjectFromLayer(obj, layer);
    }
    /**
     * Remove the given objects from all layers they may belong to.
     * @param {THREE.Object3D[]} objects The objects to remove.
     */
    removeObjectsFromAllLayers(objects) {
        for (const obj of objects)
            this.removeObjectFromAllLayers(obj);
    }
    #removeObjectFromLayer(obj, layer) {
        if (!layer)
            throw new Error('Can not remove object from layer that does not exist.');
        const children = layer.backingScene.children;
        const index = children.findIndex(proxy => proxy.__proto__ === obj);
        if (index >= 0) {
            children[index] = children[children.length - 1];
            children.pop();
        }
    }
    /**
     * Render visible layers.
     *
     * @param {THREE.Camera} camera A THREE.Camera to render all the layers with.
     *
     * @param {BeforeAllCallback | undefined} beforeAll Optional: Called before rendering all layers. If not
     * supplied, the default value will turn off the rendere's auto clearing, so that
     * each layer can be manually drawn stacked on top of each other.
     *
     * @param {BeforeEachCallback | undefined} beforeEach Optional: When the layers are being rendered in the order they are
     * defined to be in, this callback will be called right before a layer is
     * rendered. It will be passed the name of the layer that is about to be
     * rendered. By default, this does nothing.
     *
     * @param {AfterEachCallback | undefined} afterEach Optional: When the layers are being rendered in the order
     * they are defined to be in, this callback will be called right after a
     * layer is rendered. It will be passed the name of the layer that was just
     * rendered. The default is that `clearDepth()` will be called on a
     * `WebGLRenderer` to ensure layers render on top of each other from low
     * order to high order. If you provide your own callback, you'll have to
     * remember to call `clearDepth` manually, unless you wish for layers to blend into
     * the same 3D space rather than appaering as separate scenes stacked on
     * top of each other.
     */
    // IDEA: Allow different cameras per layer? It may not be common, but could
    // be useful for, for example, making background effects, etc.
    render(camera, beforeAll = this.#defaultBeforeAllCallback, beforeEach = this.#defaultBeforeEachCallback, afterEach = this.#defaultAfterEachCallback) {
        beforeAll();
        for (const layer of this.#layers) {
            if (!layer.visible)
                continue;
            beforeEach(layer.name);
            this.#renderer.render(layer.backingScene, camera);
            afterEach(layer.name);
        }
    }
    #defaultBeforeAllCallback = () => {
        if (this.#renderer instanceof WebGLRenderer) {
            this.#renderer.autoClear = false;
            this.#renderer.clear();
        }
    };
    #defaultBeforeEachCallback = () => { };
    #defaultAfterEachCallback = () => {
        // By default, the depth of a WebGLRenderer is cleared, so that layers
        // render on top of each other in order from lowest to highest order value.
        if (this.#renderer instanceof WebGLRenderer)
            this.#renderer.clearDepth();
    };
}
//# sourceMappingURL=VisualLayers.js.map
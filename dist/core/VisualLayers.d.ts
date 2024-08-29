import { Scene as ThreeScene } from 'three/src/scenes/Scene.js';
import type { Camera, Object3D, Renderer } from 'three';
import type * as THREE from 'three';
/**
 * Allows rendering objects into one ore more visual layers that are stacked on
 * top of each other. Think of it like layers in Adobe Photoshop.
 */
export declare class VisualLayers {
    __layers: Array<Layer>;
    __renderer: Renderer;
    __Scene: typeof ThreeScene;
    /**
     * @param {THREE.Renderer} renderer The `THREE.Renderer` (f.e. `THREE.WebGLRenderer`) that
     * will be used to render the layers.
     * @param {typeof THREE.Scene} Scene The `THREE.Scene` class that will be used for each layer
     * (one per layer). If not provided, `THREE.Scene` is used by default.
     */
    constructor(renderer: Renderer, Scene?: typeof ThreeScene);
    /**
     * Deletes all defined layers -- hence un-references contained objects so
     * they can be garbage collected -- as if starting with a fresh new
     * VisualLayers. Generally you should call this if you are getting rid
     * of layering, or want to define a new set of layers, etc.
     */
    dispose(): void;
    /**
     * Defines a new layer.
     * @param {LayerName} layerName The name to give the layer.
     * @param {number} order The order it will have. The newly-defined layer will
     * render above other layers that have lower numbers, and below other layers
     * that have higher order numbers.
     * @returns {Layer} The created object representing the layer.
     */
    defineLayer(layerName: LayerName, order?: number): Layer;
    /**
     * Set the visibility of one or more layers.
     * @param {LayerNames} layerNames The name of a layer (or array of names of layers) that will have its (their) visibility set.
     * @param {boolean} visible A boolean indicating whether the layer or layers should be visible.
     */
    setLayerVisible(layerNames: LayerNames, visible: boolean): void;
    __setLayerVisible(layerName: LayerName, visible: boolean): void;
    /** Get a layer by name (if it doesn't exist, creates it with default order 0). */
    __getOrMakeLayer(layerName: LayerName): Layer;
    /**
     * Remove a layer.
     * @param {LayerName} layerName The name of the layer to remove.
     */
    removeLayer(layerName: LayerName): void;
    /**
     * Check if a layer exists.
     * @param {LayerName} layerName The name of the layer to check existence of.
     * @returns {boolean} A boolean indicating if the layer exists.
     */
    hasLayer(layerName: LayerName): boolean;
    /**
     * The number of layers.
     * @readonly
     * @type {number}
     */
    get layerCount(): number;
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
    addObjectToLayer(obj: Object3D, layerNames: LayerNames, withSubtree?: boolean): void;
    /**
     * Similar to `addObjectToLayer`, but for adding multiple objects at once.
     * @param {THREE.Object3D[]} objects An array of objects that are `instanceof THREE.Object3D`.
     * @param {LayerNames} layerNames The layer or layers to add the objects to.
     * @param {boolean | undefined} withSubtree Whether rendering of the objects will also render their
     * children. See `withSubtree` of `addObjectToLayer` for more details.
     */
    addObjectsToLayer(objects: Object3D[], layerNames: LayerNames, withSubtree?: boolean): void;
    /**
     * Add an object to all currently-defined layers.
     * @param {THREE.Object3D} obj The object to add. Must be an `instanceof THREE.Object3D`.
     * @param {boolean | undefined} withSubtree Whether rendering of the object will also render its
     * children. See `withSubtree` of `addObjectToLayer` for more details.
     */
    addObjectToAllLayers(obj: Object3D, withSubtree?: boolean): void;
    /**
     * Add a set of objects to all currently-defined layers.
     * @param {THREE.Object3D[]} objects The list of `THREE.Object3D` instances to add.
     * @param {boolean | undefined} withSubtree Whether rendering of the objects will also render their
     * children. See `withSubtree` of `addObjectToLayer` for more details.
     */
    addObjectsToAllLayers(objects: Object3D[], withSubtree?: boolean): void;
    readonly __emptyArray: readonly never[];
    __addObjectToLayer(obj: Object3D, layerName: LayerName, withSubtree: boolean): void;
    __layerHasObject(layer: Layer, obj: Object3D): boolean;
    /**
     * Remove an object from a layer or set of layers.
     * @param {THREE.Object3D} obj The object to remove from the specified layer or layers.
     * @param {LayerNames} layerNames The layer or layers from which to remove the object from.
     */
    removeObjectFromLayer(obj: Object3D, layerNames: LayerNames): void;
    /**
     * Remove an object from a layer or set of layers.
     * @param {THREE.Object3D[]} objects The objects to remove from the specified layer or layers.
     * @param {LayerNames} layerNames The layer or layers from which to remove the object from.
     */
    removeObjectsFromLayer(objects: Object3D[], layerNames: LayerNames): void;
    /**
     * Remove the given object from all layers.
     * @param {THREE.Object3D} obj The object to remove.
     */
    removeObjectFromAllLayers(obj: Object3D): void;
    /**
     * Remove the given objects from all layers they may belong to.
     * @param {THREE.Object3D[]} objects The objects to remove.
     */
    removeObjectsFromAllLayers(objects: Object3D[]): void;
    __removeObjectFromLayer(obj: Object3D, layer: Layer | undefined): void;
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
    render(camera: Camera, beforeAll?: BeforeAllCallback, beforeEach?: BeforeEachCallback, afterEach?: AfterEachCallback): void;
    __defaultBeforeAllCallback: () => void;
    __defaultBeforeEachCallback: () => void;
    __defaultAfterEachCallback: () => void;
}
/** @typedef {string} LayerName */
type LayerName = string;
/** @typedef {LayerName | LayerName[]} LayerNames */
type LayerNames = LayerName | LayerName[];
/** @typedef {{name: LayerName; backingScene: THREE.Scene; order: number; visible: boolean}} Layer */
type Layer = {
    name: LayerName;
    backingScene: THREE.Scene;
    order: number;
    visible: boolean;
};
/**
 * @typedef {
 *   @function
 *   @param {LayerName} layerName
 * } BeforeEachCallback
 */
type BeforeEachCallback = (layerName: LayerName) => void;
/**
 * @typedef {
 *   @function
 * } BeforeAllCallback
 */
type BeforeAllCallback = () => void;
/**
 * @typedef {
 *   @function
 *   @param {LayerName} layerName
 *   @returns {void}
 * } AfterEachCallback
 */
type AfterEachCallback = (layerName: LayerName) => void;
export {};
//# sourceMappingURL=VisualLayers.d.ts.map
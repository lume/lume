/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import Modifier from 'famous/core/Modifier';
import RenderNode from 'famous/core/RenderNode';
import TransitionableTransform from 'famous/transitions/TransitionableTransform';
import EventHandler from 'famous/core/EventHandler';

import {simpleExtend} from './utils'

import "army-knife/polyfill.Function.name";

/**
 * Molecules are the basic building blocks of all UI components. Molecules
 * extend [famous/core/RenderNode](#famous/core/RenderNode), so they can be
 * added to any `RenderNode` of a famo.us render tree, and by default they will
 * also accept anything that a normal Famo.us `RenderNode` can accept via the
 * `add` method.  Classes that extend from `Molecule` might override
 * `RenderNode.add` in order to accept things like arrays of renderables in
 * stead of a single renderable.
 *
 * Molecules encapsulate the basic things you need for a component -- a
 * [famous/transitions/TransitionableTransform](#famous/transitions/TransitionableTransform)
 * for positioning things in space, and a [famous/core/EventHandler](#famous/core/EventHandler)
 * for capturing user interaction -- exposing a unified API for working with these
 * things. For now, [famous/core/Modifier](#famous/core/Modifier) is used as the interface
 * for applying transforms and sizing, but this will change in Mixed Mode
 * Famo.us.
 *
 * All components extend Molecule, but at the same time they can also use any
 * number of Molecules internally to do nice things like create layouts and
 * position multiple things in space.
 *
 * @class Molecule
 * @extends {module: famous/core/RenderNode}
 */
export class Molecule extends RenderNode {

    /**
     * Creates a new `Molecule` and applies `initialOptions` to it's internal
     * `famous/core/Modifier`. See [famous/core/Modifier](#famous/core/Modifier)
     * for details on what options you can pass.
     *
     * Note: Mixed Mode Famo.us does away with Modifiers, so this API will
     * change slightly, but the change will be in such a way that APIs of
     * higher level classes won't change because of this. One of the biggest
     * changes in Mixed Mode will be that `size` will be set only on a
     * per-Surface basis as far as a render tree is concerned. So if you
     * normally put multiple `Surface` instances into a `Modifier` that has a
     * size, then instead you'll have to explicitly assign a `size` to each
     * `Surface`. This is a good thing, and makes for a cleaner and easier to
     * use render tree with a separation of concerns from classes that can
     * handle boundaries and group sizing. `Molecule` might then be an example
     * of such a class with it's own size API.
     *
     * @constructor
     * @param {Object} initialOptions The options to initialize this Molecule's `Modifier` with.
     */
    constructor(initialOptions) {

        // "private" stuff. Not really, but regard it like so. For example, if
        // you see something like obj._.someVariable then you're accessing
        // internal stuff that wasn't designed to be accessed directly, and any
        // problem you enounter with that is your own problem. :)
        //
        // TODO: Use a WeakMap to store these at some point.
        this._ = {
            options: {}, // set and get with this.options
            defaultOptions: {}
        }

        // Add default values for this Molecule
        // TODO: Make default options static for the class.
        simpleExtend(this._.defaultOptions, {
            align: [0.5,0.5],
            origin: [0.5,0.5],
            transform: new TransitionableTransform,
            handler: new EventHandler
        })

        // set the user's initial options. This automatically creates
        // this.modifier, and adds it to this (don't forget, *this* is a
        // RenderNode, so a Molecule can add things to itself).
        //
        // NOTE: this.options is a setter property. This statement applies all
        // relevant properties to this.modifier.
        this.options = initialOptions;
    }

    /**
     * @property {Object} options The Molecule's options, which get applied to
     * `this.modifier`. This may change with Mixed Mode. Setting this property
     * overrides existing options. To extend existing options with new options,
     * use `setOptions` instead.  Unspecified options will be set to their default
     * values.
     *
     * Note: Anytime `this.options` is assigned a new value, `this.modifier` is set
     * to a new [famous/core/Modifier](#famous/core/Modifier).
     */
    set options(newOptions) {
        this.resetOptions();
        this.setOptions(newOptions);
    }
    get options() {
        return this._.options;
    }

    /**
     * @property {module: famous/transitions/TransitionableTransform} transform
     * The transform of this `Molecule`. The default is a
     * [famous/transitions/TransitionableTransform](#famous/transitions/TransitionableTransform).
     * Setting this property automatically puts the new transform into effect.
     * See [famous/core/Modifier.transformFrom](#famous/core/Modifier.transformFrom).
     */
    set transform(newTransform) {
        this.setOptions({transform: newTransform});
    }
    get transform() {
        return this.options.transform;
    }

    /**
     * Compounds `newOptions` into the existing options, similar to extending an
     * object and overriding only the desired properties. To override all
     * options with a set of new options, set `this.options` directly.
     *
     * An example of setting just a single option without erasing other options:
     *
     * ```js
     * var myMolecule = new Molecule()
     * myMolecule.setOptions({
     *   align: [0.2, 0.8]
     * })
     * ```
     *
     * @param {Object} newOptions An object containing the new options to apply to this `Molecule`.
     */
    setOptions(newOptions) {
        if (typeof newOptions == 'undefined' || newOptions.constructor.name != "Object")
            newOptions = {}

        for (var prop in newOptions) {
            // Subject to change when Famo.us API changes.
            if (Modifier.prototype[''+prop+'From']) {
                this.modifier[''+prop+'From'](newOptions[prop]);
            }

            this._.options[prop] = newOptions[prop];
        }
    }

    /**
     * Sets all options back to their defaults.
     *
     * Note: Anytime this is called, `this.modifier` is set to a new
     * [famous/core/Modifier](#famous/core/Modifier) having the default
     * options.
     */
    resetOptions() {
        this.modifier = new Modifier();
        this.set(this.modifier);
        this.setOptions(this._.defaultOptions);
    }

    /**
     * Forwards events from this Molecule's [famous/core/EventHandler](#famous/core/EventHandler) to the given
     * target, which can be another `EventHandler` or `Molecule`.
     *
     * This method is equivalent to [famous/core/EventHandler.pipe](#famous/core/EventHandler.pipe),
     * acting upon `this.handler`.
     *
     * TODO v0.1.0: Let this method accept a `Molecule`, then stop doing `pipe(this._.handler)` in other places
     */
    pipe() {
        var args = Array.prototype.splice.call(arguments, 0);
        return this.options.handler.pipe.apply(this.options.handler, args);
    }

    /**
     * Stops events from this Molecule's [famous/core/EventHandler](#famous/core/EventHandler)
     * from being sent to the given target.
     *
     * This method is equivalent to [famous/core/EventHandler.unpipe](#famous/core/EventHandler.unpipe),
     * acting upon `this.handler`.
     *
     * TODO v0.1.0: Let this method accept a `Molecule`, then stop doing `pipe(this.options.handler)` in other places
     */
    unpipe() {
        var args = Array.prototype.splice.call(arguments, 0);
        return this.options.handler.unpipe.apply(this.options.handler, args);
    }

    /**
     * Register an event handler for the specified event.
     * See [famous/core/EventHandler.on](#famous/core/EventHandler.on).
     */
    on() {
        var args = Array.prototype.splice.call(arguments, 0);
        return this.options.handler.on.apply(this.options.handler, args);
    }

    /**
     * Unregister an event handler for the specified event.
     * See [famous/core/EventHandler.off](#famous/core/EventHandler.off).
     */
    off() {
        var args = Array.prototype.splice.call(arguments, 0);
        return this.options.handler.on.apply(this.options.handler, args);
    }
}
export default Molecule;

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

import "javascripts/utils/Object.className";

export class Molecule extends RenderNode {
    constructor(initialOptions) {
        initialOptions = typeof initialOptions != "undefined"? initialOptions: {};

        // "private" stuff. Not really, but regard it like so. E.g. obj._.someVariable means you're accessing internal stuff.
        // TODO: make all properties of this._ non-writeable?
        this._ = {
            options: {}, // set and get by this.options
            handler: new EventHandler(),
            defaultOptions: {
                align: [0.5,0.5],
                origin: [0.5,0.5],
                transform: new TransitionableTransform()
            }
        };

        // set the user's initial options. This automatically creates this.modifier, and add it to this (RenderNode).
        this.options = initialOptions.className == "Object"? initialOptions: {} // make sure we have an object literal.
    }

    // EventHandler interface
    pipe() {
        var args = Array.prototype.splice.call(arguments, 0);
        return this._.handler.pipe.apply(this._.handler, args);
    }
    unpipe() {
        var args = Array.prototype.splice.call(arguments, 0);
        return this._.handler.unpipe.apply(this._.handler, args);
    }
    on() {
        var args = Array.prototype.splice.call(arguments, 0);
        return this._.handler.on.apply(this._.handler, args);
    }
    off() {
        var args = Array.prototype.splice.call(arguments, 0);
        return this._.handler.on.apply(this._.handler, args);
    }

    // getters and setters for Molecule.options
    set options(newOptions) {
        this.resetOptions();
        this.setOptions(newOptions);
    }
    get options() {
        return this._.options;
    }
    setOptions(newOptions) {
        newOptions = typeof newOptions != "undefined"? newOptions: {};

        if (newOptions.className != "Object") { return; }

        for (var prop in newOptions) {
            if (Modifier.prototype[''+prop+'From']) {
                this.modifier[''+prop+'From'](newOptions[prop]);
            }

            // TODO: delete the non-writeable transform property before setting it.
            this._.options[prop] = newOptions[prop];
            // TODO: set the transform property as a non-writeable property after setting it.
        }
    }
    resetOptions() {
        this.modifier = new Modifier(); // what happened to the old Modifier? Is it the infamous Famo.us memory leak?
        this.set(this.modifier);
        this.setOptions(this._.defaultOptions);
    }

    set transform(newTransform) {
        this.setOptions({transform: newTransform});
    }
    get transform() {
        return this.options.transform;
    }
}
export default Molecule;

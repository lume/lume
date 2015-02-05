/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Surface = require('../core/Surface');

    /**
     * A Famo.us surface in the form of an HTML input element.
     *   This extends the Surface class.
     *
     * @class InputSurface
     * @extends Surface
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {string} [options.placeholder] placeholder text hint that describes the expected value of an <input> element
     * @param {string} [options.type] specifies the type of element to display (e.g. 'datetime', 'text', 'button', etc.)
     * @param {string} [options.value] value of text
     */
    function InputSurface(options) {
        Surface.apply(this, arguments);

        this.on('click', this.focus.bind(this));
        window.addEventListener('click', function(event) {
            if (event.target !== this._currentTarget) this.blur();
        }.bind(this));

        if (options.attributes && options.attributes.onclick)
            this._onClick = options.attributes.onclick;
    }
    InputSurface.prototype = Object.create(Surface.prototype);
    InputSurface.prototype.constructor = InputSurface;

    InputSurface.prototype.elementType = 'input';
    InputSurface.prototype.elementClass = 'famous-surface';

    /**
     * Focus on the current input, pulling up the keyboard on mobile.
     *
     * @method focus
     * @return {InputSurface} this, allowing method chaining.
     */
    InputSurface.prototype.focus = function focus() {
        if (this._currentTarget) this._currentTarget.focus();
        return this;
    };

    /**
     * Blur the current input, hiding the keyboard on mobile.
     *
     * @method blur
     * @return {InputSurface} this, allowing method chaining.
     */
    InputSurface.prototype.blur = function blur() {
        if (this._currentTarget) this._currentTarget.blur();
        return this;
    };

    InputSurface.prototype.recall = function deploy(target){
        if (this._onClick) target.onclick = null;
        return Surface.prototype.recall.apply(this, arguments);
    };

    InputSurface.prototype.deploy = function deploy(target){
        if (this._onClick) target.onclick = this._onClick;
        return Surface.prototype.deploy.apply(this, arguments);
    };

    module.exports = InputSurface;
});

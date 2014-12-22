/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Surface = require('../core/Surface');

    /**
     * A Famo.us surface in the form of an HTML textarea element.
     *   This extends the Surface class.
     *
     * @class TextareaSurface
     * @extends Surface
     * @constructor
     * @param {Object} [options] overrides of default options
     * @param {string} [options.placeholder] placeholder text hint that describes the expected value of an textarea element
     * @param {string} [options.value] value of text
     * @param {string} [options.name] specifies the name of textarea
     * @param {string} [options.wrap] specify 'hard' or 'soft' wrap for textarea
     * @param {number} [options.cols] number of columns in textarea
     * @param {number} [options.rows] number of rows in textarea
     */
    function TextareaSurface(options) {
        Surface.apply(this, arguments);
        this.on('click', this.focus.bind(this));
    }
    TextareaSurface.prototype = Object.create(Surface.prototype);
    TextareaSurface.prototype.constructor = TextareaSurface;

    TextareaSurface.prototype.elementType = 'textarea';
    TextareaSurface.prototype.elementClass = 'famous-surface';

    /**
     * Focus on the current input, pulling up the keyboard on mobile.
     *
     * @method focus
     * @return {TextareaSurface} this, allowing method chaining.
     */
    TextareaSurface.prototype.focus = function focus() {
        if (this._currentTarget) this._currentTarget.focus();
        return this;
    };

    /**
     * Blur the current input, hiding the keyboard on mobile.
     *
     * @method focus
     * @return {TextareaSurface} this, allowing method chaining.
     */
    TextareaSurface.prototype.blur = function blur() {
        if (this._currentTarget) this._currentTarget.blur();
        return this;
    };

    module.exports = TextareaSurface;
});

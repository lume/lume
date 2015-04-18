/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

/* Modified work copyright © 2015 David Valdman */

define(function(require, exports, module) {
    var ContainerSurface = require('./ContainerSurface');

    function FormContainerSurface(options) {
        ContainerSurface.apply(this, arguments);
    }

    FormContainerSurface.prototype = Object.create(ContainerSurface.prototype);
    FormContainerSurface.prototype.constructor = FormContainerSurface;

    FormContainerSurface.prototype.elementType = 'form';

    module.exports = FormContainerSurface;
});

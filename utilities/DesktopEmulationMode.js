/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var hasTouch = 'ontouchstart' in window;

    function kill(type) {
        window.addEventListener(type, function(event) {
            event.stopPropagation();
            return false;
        }, true);
    }

    if (hasTouch) {
        kill('mousedown');
        kill('mousemove');
        kill('mouseup');
        kill('mouseleave');
    }
});

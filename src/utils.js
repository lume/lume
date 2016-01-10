/*
 * @overview Utility functions used by infamous.
 *
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import Engine from 'famous/src/core/Engine';

/**
 * Creates a [famous/src/core/Context](#famous/src/core/Context) having the specified 3D perspective.
 *
 * @param {Number} perspective The integer amount of perspective to apply to the `Context`.
 * @returns {module: famous/src/core/Context} The `Context` with the applied perspective.
 */
export function contextWithPerspective(perspective) {
    var context = Engine.createContext();
    context.setPerspective(perspective);
    return context;
}

export function simpleExtend(object, ...others) {
    others.forEach(function(other) {
        for (var prop in other) {
            object[prop] = other[prop]
        }
    })
}

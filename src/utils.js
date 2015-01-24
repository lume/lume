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

import Engine from 'famous/core/Engine';

/*
 * Creates a context having the specified 3D perspective.
 *
 * @param {integer} perspective The amount of perspective to give the context.
 * @returns {module: famous/core/Context} The context with the applied perspective.
 */
export function contextWithPerspective(perspective) {
    var context = Engine.createContext();
    context.setPerspective(perspective);
    return context;
}

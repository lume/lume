/*
 * LICENSE
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import Engine from 'famous/core/Engine';

export function contextWithPerspective(perspective) {
    var context = Engine.createContext();
    context.setPerspective(perspective);
    return context;
}

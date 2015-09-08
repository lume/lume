import './styles/motor.css'

import animation      from './animation'
import nodeComponents from './nodeComponents'
import core           from './core'
import nodes          from './nodes'
import renderers      from './renderers'
import utilities      from './utilities'

/*
 * A global can be built by compiling this file, but we do not recommend it. We
 * suggest using a build system and importing individual classes into your
 * project as needed, so that your compiled app code will contain only the
 * libraries it uses, resulting in less data needed to be transferred to users
 * of your app.
 */
export default {
    animation,
    nodeComponents,
    core,
    nodes,
    renderers,
    utilities,
}

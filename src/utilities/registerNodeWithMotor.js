import Motor from '../core/Motor'

/**
 * Registers the given node with the Motor singleton.
 *
 * @param {../nodes/InternalNode} node The given InternalNode.
 * @param {./Privates} __ The private property helper of the given node.
 */
export default
function registerNodeWithMotor(node, __) {

        // Motor is a singleton, so if it already exists, the existing one is
        // returned from the constructor here.
        let motor = __(node).motor = new Motor

        // registers the given InternalNode with the Motor, which creates it's worker twin
        // in the SceneWorker.
        motor.registerNode(node)
}

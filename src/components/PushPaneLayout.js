import Node from '../core/Node'
import HTMLPushPaneLayout from '../html/push-pane-layout'

export default
class PushPaneLayout extends Node {
    constructor(...args) {
        console.log(' -- PushPaneLayout created')
        super(...args)
    }

    /**
     * @override
     */
    _makeElement() {
        return new HTMLPushPaneLayout
    }
}

import HTMLNode from './HTMLNode'
import PushPaneLayout from '../components/PushPaneLayout'

export default
HTMLNode.subclass( 'HTMLPushPaneLayout', {
    static: {
        define(name) {
            customElements.define(name || 'i-push-pane-layout', HTMLPushPaneLayout)
        }
    },

    // @override
    _makeImperativeCounterpart() {
        return new PushPaneLayout({}, this)
    },
})

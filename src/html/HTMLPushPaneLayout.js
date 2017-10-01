import HTMLNode from './HTMLNode'
import PushPaneLayout from '../components/PushPaneLayout'

class HTMLPushPaneLayout extends HTMLNode {
    static define(name) {
        customElements.define(name || 'i-push-pane-layout', HTMLPushPaneLayout)
    }

    // @override
    _makeImperativeCounterpart() {
        return new PushPaneLayout({}, this)
    }
}

export {HTMLPushPaneLayout as default}

import HTMLNode from './HTMLNode'
import PushPaneLayout from '../components/PushPaneLayout'

class HTMLPushPaneLayout extends HTMLNode {
    createdCallback() {
        console.log(' -- HTMLPushPaneLayout created')
        super.createdCallback()
    }

    // @override
    _makeImperativeCounterpart() {
        return new PushPaneLayout({}, this)
    }
}

export {HTMLPushPaneLayout as default}

import MotorHTMLNode from './node'
import PushPaneLayout from '../motor/PushPaneLayout'

console.log(' --- push-pane-layout module.')

class MotorHTMLPushPaneLayout extends MotorHTMLNode {
    createdCallback() {
        console.log(' -- MotorHTMLPushPaneLayout created')
        super.createdCallback()
    }

    // @override
    _makeImperativeCounterpart() {
        return new PushPaneLayout({}, this)
    }
}

export default
document.registerElement('motor-push-pane-layout', MotorHTMLPushPaneLayout)

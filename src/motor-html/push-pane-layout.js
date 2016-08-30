import MotorHTMLNode from './node'
import PushPaneLayout from '../motor/PushPaneLayout'

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

export {MotorHTMLPushPaneLayout as default}

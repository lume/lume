import DOMNode from './DOMNode'

// This class is an alias for DOMNode/i-dom-node
export default
class DOMPlane extends DOMNode {
    static get defaultElementName() { return 'i-dom-plane' }
    static get _Class() { return DOMPlane }
}

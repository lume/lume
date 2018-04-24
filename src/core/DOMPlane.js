import Class from 'lowclass'
import DOMNode from './DOMNode'

// This class is an alias for DOMNode/i-dom-node
export default
Class('DOMPlane').extends( DOMNode, {
    static: {
        defaultElementName: 'i-dom-plane',
    },
})

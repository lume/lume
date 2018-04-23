import Class from 'lowclass'
import {native} from 'lowclass/native'
import DOMNode from './DOMNode'

// This class is an alias for DOMNode/i-dom-node
export default
Class('DOMPlane').extends( native(DOMNode), {
    static: {
        defaultElementName: 'i-dom-plane',
    },
})

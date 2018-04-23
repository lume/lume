import Class from 'lowclass'
import {native} from 'lowclass/native'
import Mesh from './Mesh'

export default
Class('DOMNode').extends( native(Mesh), {
    static: {
        defaultElementName: 'i-dom-node',

        defaultBehaviors: {
            'domnode-geometry': initialBehaviors => {
                return !initialBehaviors.some( b => b.endsWith( '-geometry' ) )
            },
            'domnode-material': initialBehaviors => {
                return !initialBehaviors.some( b => b.endsWith( '-material' ) )
            },
        },
    },

    get isDOMNode() { return true },
})

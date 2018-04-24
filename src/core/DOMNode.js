import Class from 'lowclass'
import Mesh from './Mesh'

export default
Class('DOMNode').extends( Mesh, {
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

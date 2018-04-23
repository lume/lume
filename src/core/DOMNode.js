import Mesh from './Mesh'

export default
class DOMNode extends Mesh {
    static get defaultElementName() { return 'i-dom-node' }

    get isDOMNode() { return true }

    static get defaultBehaviors() {
        return {
            'domnode-geometry': initialBehaviors => {
                return !initialBehaviors.some( b => b.endsWith( '-geometry' ) )
            },
            'domnode-material': initialBehaviors => {
                return !initialBehaviors.some( b => b.endsWith( '-material' ) )
            },
        }
    }
}

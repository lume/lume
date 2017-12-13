import Mesh from './Mesh'

export default
class DOMPlane extends Mesh {
    static get defaultElementName() { return 'i-dom-plane' }
    static get _Class() { return DOMPlane }

    get isDOMPlane() { return true }

    static get defaultBehaviors() {
        return {
            'domplane-geometry': initialBehaviors => {
                return !initialBehaviors.some( b => b.endsWith( '-geometry' ) )
            },
            'domplane-material': initialBehaviors => {
                return !initialBehaviors.some( b => b.endsWith( '-material' ) )
            },
        }
    }
}

import Mesh from './Mesh'

export default
class Box extends Mesh {
    static get defaultElementName() { return 'i-box' }
    static get _Class() { return Box }

    static get defaultBehaviors() {
        return {
            'box-geometry': initialBehaviors => {
                return !initialBehaviors.some( b => b.endsWith( '-geometry' ) )
            },
            'phong-material': initialBehaviors => {
                return !initialBehaviors.some( b => b.endsWith( '-material' ) )
            },
        }
    }
}

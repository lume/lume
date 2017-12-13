import Mesh from './Mesh'

export default
class Plane extends Mesh {
    static get defaultElementName() { return 'i-plane' }
    static get _Class() { return Plane }

    static get defaultBehaviors() {
        return {
            'plane-geometry': initialBehaviors => {
                return !initialBehaviors.some( b => b.endsWith( '-geometry' ) )
            },
            'phong-material': initialBehaviors => {
                return !initialBehaviors.some( b => b.endsWith( '-material' ) )
            },
        }
    }
}

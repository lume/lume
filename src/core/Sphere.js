import Mesh from './Mesh'

export default
class Sphere extends Mesh {
    static get defaultElementName() { return 'i-sphere' }
    static get _Class() { return Sphere }

    static get defaultBehaviors() {
        return {
            'sphere-geometry': initialBehaviors => {
                return !initialBehaviors.some( b => b.endsWith( '-geometry' ) )
            },
            'phong-material': initialBehaviors => {
                return !initialBehaviors.some( b => b.endsWith( '-material' ) )
            },
        }
    }
}

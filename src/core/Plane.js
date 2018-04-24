import Class from 'lowclass'
import Mesh from './Mesh'

export default
Class('Plane').extends( Mesh, {

    static: {
        defaultElementName: 'i-plane',

        defaultBehaviors: {
            'plane-geometry': initialBehaviors => {
                return !initialBehaviors.some( b => b.endsWith( '-geometry' ) )
            },
            'phong-material': initialBehaviors => {
                return !initialBehaviors.some( b => b.endsWith( '-material' ) )
            },
        },
    },
})

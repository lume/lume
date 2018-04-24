import Class from 'lowclass'
import Mesh from './Mesh'

export default
Class('Box').extends( Mesh, {
    static: {
        defaultElementName: 'i-box',

        defaultBehaviors: {
            'box-geometry': initialBehaviors => {
                return !initialBehaviors.some( b => b.endsWith( '-geometry' ) )
            },
            'phong-material': initialBehaviors => {
                return !initialBehaviors.some( b => b.endsWith( '-material' ) )
            },
        },
    },
})

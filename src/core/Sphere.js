import Class from 'lowclass'
import Mesh from './Mesh'

export default Class('Sphere').extends(Mesh, () => ({
    static: {
        defaultElementName: 'i-sphere',

        defaultBehaviors: {
            'sphere-geometry': initialBehaviors => {
                return !initialBehaviors.some(b => b.endsWith('-geometry'))
            },
            'phong-material': initialBehaviors => {
                return !initialBehaviors.some(b => b.endsWith('-material'))
            },
        },
    },
}))

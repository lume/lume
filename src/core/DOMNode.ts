import Mesh from './Mesh'

export default class DOMNode extends Mesh {
    static defaultElementName = 'i-dom-node'

    static defaultBehaviors = {
        'domnode-geometry': (initialBehaviors: any) => {
            return !initialBehaviors.some((b: any) => b.endsWith('-geometry'))
        },
        'domnode-material': (initialBehaviors: any) => {
            return !initialBehaviors.some((b: any) => b.endsWith('-material'))
        },
    }

    get isDOMNode() {
        return true
    }
}

export {DOMNode}

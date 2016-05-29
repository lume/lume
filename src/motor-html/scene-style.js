import nodeStyles from './node-style'

export default {
    'motor-scene': Object.assign({}, nodeStyles['motor-node'], {
        //display:   'block',
        //boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        width:    '100%',
        height:   '100%',

        // Constant perspective for now.
        // TODO: make settable. issue #32
        perspective: 1000,

        // XXX: Do we need this? Make it configurable?
        //perspectiveOrigin: '25%',
    })
}

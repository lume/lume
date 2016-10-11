import nodeStyles from './node-style'

export default
Object.assign({}, nodeStyles, {
    position: 'relative',
    overflow: 'hidden',
    width:    '100%',
    height:   '100%',

    // Constant perspective for now.
    // TODO: make settable. issue #32
    perspective: 1000,

    // TODO: Do we need this? Make it configurable?
    //perspectiveOrigin: '25%',
})

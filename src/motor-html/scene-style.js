import nodeStyles from './node-style'

export default
Object.assign({}, nodeStyles, {
    position: 'relative',
    overflow: 'hidden',
    width:    '100%',
    height:   '100%',

    // Constant perspective for now.
    perspective: 1000,
    //perspectiveOrigin: '25%',
})

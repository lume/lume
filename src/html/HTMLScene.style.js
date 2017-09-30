import nodeStyles from './HTMLNode.style'

export default {
    ...nodeStyles,

    position: 'relative',
    overflow: 'hidden',
    width:    '100%',
    height:   '100%',

    // Constant perspective for now.
    perspective: 1000,
    //perspectiveOrigin: '25%',
}

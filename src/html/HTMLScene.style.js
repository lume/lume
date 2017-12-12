import nodeStyles from './HTMLNode.style'

export default {
    ...nodeStyles,

    position: 'static',
    overflow: 'hidden',

    // Constant perspective for now.
    perspective: 1000,
    //perspectiveOrigin: '25%',
}

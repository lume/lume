import nodeStyles from './node-style'

export default {
    // XXX: What is a better pattern that doesn't require hard coding the class
    // names here?
    MotorHTMLScene: Object.assign({}, nodeStyles['MotorHTMLNode'], {
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

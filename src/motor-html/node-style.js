
export default {
    'motor-node': {
        display:         'block',
        position:        'absolute',
        top:             0,
        left:            0,

        // TODO: set via JavaScript. Defaults to [0.5,0.5,0.5] (the Z axis
        // doesn't apply for DOM elements, but will for 3D objects in WebGL.)
        transformOrigin: '50% 50% 0', // default

        transformStyle:  'preserve-3d',
    },
}

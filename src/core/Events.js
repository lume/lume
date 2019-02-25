export const eventNames = Object.freeze([

    // Listen to this event on an element to run custom logic after the
    // element's GL objects have been initialized.
    // GL_LOAD fires after BEHAVIOR_GL_LOAD, so GL_LOAD guarantees that both the
    // element and the element's behaviors are done loading GL objects.
    'GL_LOAD',
    // Listen to this event on an element to clean up after the element's GL
    // objects have been cleaned up and released.
    // GL_UNLOAD fires after BEHAVIOR_GL_UNLOAD, so GL_UNLOAD guarantees that
    // both the element and the element's behaviors are done unloading GL
    // objects.
    'GL_UNLOAD',

    // Listen to this event on an element to run custom logic after the
    // element's CSS objects have been initialized.
    'CSS_LOAD',
    // Listen to this event on an element to clean up after the element's CSS
    // objects have been cleaned up and released.
    'CSS_UNLOAD',

    // Listen to this event on an element to run custom logic after the
    // element's GL objects have been initialized. This is for use by element
    // behaviors. Code that is outside of a given element and outside of the
    // given element's behaviors should listen to GL_LOADED instead.
    'BEHAVIOR_GL_LOAD',
    // Listen to this event on an element to clean up after the element's GL
    // objects have been initialized. This is for use by element behaviors. Code
    // that is outside of a given element and outside of the given element's
    // behaviors should listen to GL_LOADED instead.
    'BEHAVIOR_GL_UNLOAD',
])

export const Events = {}

// make an enum of events
for (const eventName of eventNames) {
    Events[eventName] = eventName
}

Object.freeze(Events)

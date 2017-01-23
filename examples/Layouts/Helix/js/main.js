define(function(require, exports, module){
    var Context = require('samsara/dom/Context');
    var Transitionable = require('samsara/core/Transitionable');
    var Accumulator = require('samsara/streams/Accumulator');
    var Fingers = require('samsara/ui/Fingers');
    var PinchInput = require('samsara/inputs/PinchInput');
    var RotateInput = require('samsara/inputs/RotateInput');
    var Transform = require('samsara/core/Transform');

    var Helix = require('./app/Helix');
    var Helicoid = require('./app/Helicoid');
    var ParameterPanel = require('./app/ParameterPanel');
    var GesturePanel = require('./app/GesturePanel');
    var Nav = require('./app/Nav');

    // Build Render Tree
    var context = new Context();

    var helixOpacity = new Transitionable(1);

    var parameters = new ParameterPanel({
        proportions : [.7, .5],
        origin : [0.5,0],
        spacing: 0,
        perspective: 1000,
        perspectiveOriginX: .5,
        perspectiveOriginY: .5,
        proportionsX: .8,
        proportionsY: .8,
        sliderHeight: 45,
        transition: {curve : 'spring', period : 100, damping : .7}
    });

    var pinchInputY = new PinchInput({scale : .2, direction : 1});
    var pinchInputX = new PinchInput({scale : .3, direction : 0});

    var radius = new Accumulator(700, {min : 50});
    radius.subscribe(pinchInputX.pluck('delta'));

    var pitch = new Accumulator(100, {min: -300, max: 300});
    pitch.subscribe(pinchInputY.pluck('delta'));

    var helix = new Helix({
        origin : [0,1],
        N: 8,
        spacing: parameters.spacing.value,
        perspective: parameters.perspective.value,
        pitch: pitch,
        radius: radius,
        perspectiveOrigin: parameters.perspectiveOrigin,
        itemProportions: parameters.proportions
    });

    context
        .add({
            align : [0,1]
        })
        .add({size : function(parentSize){
            return [parentSize[0], parentSize[1] - 50];
        }})
        .add({align : [0.5,0.5], opacity : helixOpacity})
        .add(helix);

    context.mount(document.querySelector('#helix'));

    var overlayContext = new Context();

    var nav = new Nav();

    var transition = {duration : 300};
    nav.on('toggle-params', function(){
        console.log('toggle-params')
        helixOpacity.set(.5, transition);
        parameters.show(transition);
        nav.hide(transition);
    });

    nav.on('toggle-gesture', function(){
        console.log('toggle-gesture')
        helixOpacity.set(.1, transition);
        gestures.show(transition);
        nav.hide(transition);
    });

    nav.on('close', function(){
        console.log('close')
        helixOpacity.set(1, transition);
        gestures.hide(transition);
        parameters.hide(transition);
        nav.show(transition);
    });

    overlayContext
        .add({size : [undefined, 50]})
        .add(nav);

    // var fingers = new Fingers();
    // fingers.subscribe(context);
    // overlayContext.add(fingers);

    overlayContext
        .add({
            transform : Transform.translateY(100),
            align : [.5, 0]
        })
        .add(parameters);

    var gestures = new GesturePanel({
        proportions : [.4, 1],
        origin : [.5,0]
    });

    overlayContext
        .add({
            transform : Transform.translateY(100),
            align : [.5, 0]
        })
        .add(gestures);

    overlayContext.mount(document.querySelector('#overlay'));

    pinchInputX.subscribe(context);
    pinchInputY.subscribe(context);
});
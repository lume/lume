var Scene = boxer.core.Scene,
    controller,
    header,
    footer,
    aside,
    mainContent,
    navOpen = false;

//used res.js for responsive states
var respond = new res([{
                     "state": "mobile",
                     "breakpoint": 640,
                     "cols": 4,
                     "margin": 20,
                     "gutter": 20
                 },
                 {
                     "state": "desktop",
                     "breakpoint": 3840,
                     "cols": 16,
                     "margin": 160,
                     "gutter": 40
                 }]);

                 //create model for layout

var nodes = [{
   position: 'absolute',
   origin : [0.0,0.0,0.0],
   align : [0.0,0.0,1],
   size : [1.0,1.0,0],
   scale : [1.0,1.0,1.0],
   rotate: [0,0,0],
   id: 'app-background',
   opacity : 1.0,
   classes: ['dark-black-bg']
},{
   position: 'absolute',
   origin : [0.0,0.0,0.0],
   align : [0.0,0.0,1],
   size : [1.0,0.1,0],
   scale : [1.0,1.0,1.0],
   rotate: [0,0,0],
   id: 'app-header',
   opacity : 1.0,
   classes: ['dark-grey-bg', 'dark-white']
},
{
   position: 'absolute',
   origin : [0.0,0.0,0.0],
   align : [0.0,0.1,1],
   translate: respond.state === 'desktop' ? [0.3336*window.innerWidth*-1,0,1] : [window.innerWidth*-1,0,1],
   size : respond.state === 'desktop' ? [0.3336,0.8,0] : [1.0,0.8,0],
   scale : [1.0,1.0,1.0],
   rotate: [0,0,0],
   id: 'app-sidebar',
   opacity : 1.0,
   classes: ['dark-yellow-bg']
},
{
   position: 'absolute',
   origin : [0.0,0.0,0.0],
   align : [0.0,0.1,1],
   translate: [0,0,1],
   size : [1.0,0.8,0],
   scale : [1.0,1.0,1.0],
   rotate: [0,0,0],
   id: 'app-content',
   opacity : 1.0,
   classes: ['dark-white-bg', 'dark-black']
},
{
   position: 'absolute',
   origin : [0.0,1.0,1],
   align : [0.0,0.9,1],
   size : [1.0,0.1,0],
   scale : [1.0,1.0,1.0],
   rotate: [0,0,0],
   id: 'app-footer',
   opacity : 1.0,
   classes: ['dark-grey-bg', 'dark-white']
}];

//inject model into ViewController, creates Nodes and DOMComponents
controller = new ViewController(nodes, Scene);

//select individual DOMComponents
header = controller.getComponent({id:'app-header'});
aside = controller.getComponent({id:'app-sidebar'});
mainContent = controller.getComponent({id:'app-content'});
footer = controller.getComponent({id:'app-footer'});

//add a DOMComponent to the controller
controller.addComponent({
    position: 'absolute',
    translate : [20,20,0],
    size : [40,30,0],
    scale : [1.0,1.0,1.0],
    rotate: [0,0,0],
    id: 'app-hamburger',
    opacity : 1.0
},'div', header.elem);

//select the DOMComponent to work with it, maybe addComponent should just return.
hamburger = controller.getComponent({id:'app-hamburger'});

//set innerHTML of a DOMComponent's DOMElement
footer.setContent('<a href="https://github.com/infamous/boxer">Prototype CSS 3D Matrix Rendering Engine on Github</a>');

//select the DOMElement on any DOMComponent and work with it
hamburger.elem.addEventListener('click',function(){

  if(navOpen === false) {

  controller.transition('app-sidebar',{
      key: 'translate',
      from: respond.state === 'desktop' ? [0.3336*window.innerWidth*-1,0,1] : [window.innerWidth*-1,0,1],
      to: [0,0,1],
      curve: 'inOutSine',
      duration:300,
      delay: 0
  });
  controller.transition('app-content',{
      key: 'align',
      from: [0.0,0.1,0.0],
      to: respond.state === 'desktop' ? [0.3336,0.1,1] : [1.0,0.1,1],
      curve: 'inOutSine',
      duration:300,
      delay: 0
  });
  controller.transition('app-content',{
      key: 'size',
      from: [1.0,0.8,0],
      to: respond.state === 'desktop' ? [0.6667,0.8,0]: [1.0,0.8,0] ,
      curve: 'inOutSine',
      duration:300,
      delay: 0
  });

  navOpen = true;

} else {

  controller.transition('app-sidebar',{
      key: 'translate',
      from: [0,0,1],
      to: respond.state === 'desktop' ? [0.3336*window.innerWidth*-1,0,1] : [window.innerWidth*-1,0,1],
      curve: 'inOutSine',
      duration:300,
      delay: 0
  });
  controller.transition('app-content',{
      key: 'align',
      from: respond.state === 'desktop' ? [0.3336,0.1,1] : [1.0,0.1,1],
      to: [0.0,0.1,0.0],
      curve: 'inOutSine',
      duration:300,
      delay: 0
  });
  controller.transition('app-content',{
      key: 'size',
      from: respond.state === 'desktop' ? [0.6667,0.8,0]: [1.0,0.8,0] ,
      to: [1.0,0.8,0],
      curve: 'inOutSine',
      duration:300,
      delay: 0
  });

  navOpen = false;
}

});

// stateChange emitted from res.js library, resizes elements

window.addEventListener('resize',function(ev){

  if(respond.state === 'mobile'){
    controller.transition('app-sidebar',{
        key: 'size',
        from: [0.3336,0.8,0],
        to: [1.0,0.8,0],
        curve: 'inOutSine',
        duration:300,
        delay: 0
    });

    if(navOpen) {
      controller.transition('app-sidebar',{
          key: 'translate',
          from: [0.0,0.1,1],
          to: [0.0,0.1,1],
          curve: 'inOutSine',
          duration:300,
          delay: 0
      });
      controller.transition('app-content',{
          key: 'size',
          from: [0.6667,0.8,0],
          to: [1.0,0.8,0],
          curve: 'inOutSine',
          duration:300,
          delay: 0
      });
      controller.transition('app-content',{
          key: 'align',
          from: [1.0,0.1,1],
          to: [1.0,0.1,1],
          curve: 'inOutSine',
          duration:300,
          delay: 0
      });
    } else {
      controller.transition('app-sidebar',{
          key: 'translate',
          from: [window.innerWidth*-1,0,1],
          to: [window.innerWidth*-1,0,1],
          curve: 'inOutSine',
          duration:300,
          delay: 0
      });
      controller.transition('app-content',{
          key: 'size',
          from: [1.0,0.8,0],
          to: [1.0,0.8,0],
          curve: 'inOutSine',
          duration:300,
          delay: 0
      });
      controller.transition('app-content',{
          key: 'align',
          from: [0.0,0.1,1],
          to: [0.0,0.1,1],
          curve: 'inOutSine',
          duration:300,
          delay: 0
      });
    }
  }

  if(respond.state === 'desktop'){
    controller.transition('app-sidebar',{
        key: 'size',
        from: [1.0,0.8,0],
        to: [0.3336,0.8,0],
        curve: 'inOutSine',
        duration:300,
        delay: 0
    });

    if(navOpen) {
      controller.transition('app-sidebar',{
          key: 'translate',
          from: [0.0,0,1],
          to: [0.0,0,1],
          curve: 'inOutSine',
          duration:300,
          delay: 0
      });
      controller.transition('app-content',{
          key: 'size',
          from: [1.0,0.8,0],
          to: [0.6667,0.8,0],
          curve: 'inOutSine',
          duration:300,
          delay: 0
      });
      controller.transition('app-content',{
          key: 'align',
          from: [0.3336,0.1,1],
          to: [0.3336,0.1,1],
          curve: 'inOutSine',
          duration:300,
          delay: 0
      });
    } else {

      controller.transition('app-sidebar',{
          key: 'translate',
          from: [0.3336*window.innerWidth*-1,0,1],
          to: [0.3336*window.innerWidth*-1,0,1],
          curve: 'inOutSine',
          duration:300,
          delay: 0
      });
      controller.transition('app-content',{
          key: 'size',
          from: [1.0,0.8,0],
          to: [1.0,0.8,0],
          curve: 'inOutSine',
          duration:300,
          delay: 0
      });
      controller.transition('app-content',{
          key: 'align',
          from: [0.0,0.1,1],
          to: [0.0,0.1,1],
          curve: 'inOutSine',
          duration:300,
          delay: 0
      });
    }


  }

});

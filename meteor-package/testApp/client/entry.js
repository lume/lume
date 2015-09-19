import dat from 'dat.gui/build/dat.gui'

// motor is imported as a Meteor package import:
//let motor = Packages['infamous:motor'].motor

let Scene = motor.engine.Scene
let Node = motor.engine.Node

console.log('dat?', dat)
console.log(motor)

var children = [];
var modes = {
  table: [],
  grid: [],
  grid2d: [],
  sphere: [],
  helix: []
};

Meteor.startup(function() {
  var scene = new Scene();

  var featuresList = new Node({
    classes: ['features-list'],
    position: [0, 0],
    size: {
      modes: ['relative', 'relative'],
      proportional: [1, 1]
    },
    align: [0, 0, 0],
    opacity: 1
  });

  //var features = App.manager.features.Viewport.features;

  //for ( var i = 0; i < features.length; i += 1 ) {
  for ( var i = 0; i < 20; i += 1 ) {

    // Nodes
    var node = new Node({
      classes: ['view'],
      position: [300, 300],
      // position: [
      //   Math.random() * 4000 - 2000,
      //   Math.random() * 4000 - 2000,
      //   Math.random() * 4000 - 2000
      // ],
      size: {
        modes: ['absolute', 'absolute'],
        absolute: [100, 100]
      },
      align: [0, 0, 0],
      // rotation: [
      //   Math.random() * 4000 - 2000,
      //   Math.random() * 4000 - 2000,
      //   Math.random() * 4000 - 2000
      // ],
      // scale: [
      //   Math.random() * 4000 - 2000,
      //   Math.random() * 4000 - 2000,
      //   Math.random() * 4000 - 2000
      // ],
      opacity: 1
    });

    // var node2 = new Node({
    //   classes: ['viewChild'],
    //   position: [0, 0, 0],
    //   size: {
    //     modes: ['absolute', 'absolute'],
    //     absolute: [100, 100]
    //   },
    //   align: [0, 0, 0],
    //   // rotation: [
    //   //   Math.random() * 4000 - 2000,
    //   //   Math.random() * 4000 - 2000,
    //   //   Math.random() * 4000 - 2000
    //   // ],
    //   // scale: [
    //   //   Math.random() * 4000 - 2000,
    //   //   Math.random() * 4000 - 2000,
    //   //   Math.random() * 4000 - 2000
    //   // ],
    //   opacity: 1
    // });

    // //node.addChild(node2)

    scene.addChild(node);
    children.push(node);
  }


  // table
  for (var i = 0; i < children.length; i++) {
    var node = new Node({
      position: [
        0,
        i * 160,
        0
      ]
    });

    modes.table.push(node);
  }

  // grid 2d
  for (var i = 0; i < children.length; i++) {
    var row
    var node = new Node({
      position: [
        ( ( i % 5 ) * 120 ),
        ( Math.floor( i / 5 ) ) * 120,
        0
      ]
    });

    modes.grid2d.push(node);
  }

  // sphere
  var vector = new THREE.Vector3();
  for (var i = 0, l = children.length; i < l; i++) {
    var phi = Math.acos( -1 + ( 2 * i ) / l );
    var theta = Math.sqrt( l * Math.PI ) * phi;

    var node = new Node({
      position: [
        800 * Math.cos(theta) * Math.sin(phi),
        800 * Math.sin(theta) * Math.sin(phi),
        800 * Math.cos(phi)
      ]
    });

    vector.copy(node.position).multiplyScalar(2);
    node.lookAt(vector);

    modes.sphere.push(node);
  }

  // helix
  var vector = new THREE.Vector3();
  for (var i = 0, l = children.length; i < l; i++) {
    var phi = i * 0.175 + Math.PI;

    var node = new Node({
      position: [
        900 * Math.sin(phi),
        - (i * 8) + 450,
        900 * Math.cos(phi)
      ]
    });

    vector.x = node.position.x * 2;
    vector.y = node.position.y;
    vector.z = node.position.z * 2;

    node.lookAt(vector);
    modes.helix.push(node);
  }

  // grid
  for ( var i = 0; i < children.length; i ++ ) {
    var node = new Node({
      position: [
        ( ( i % 5 ) * 200 ) - 400,
        ( - ( 1 % 1 ) * 200 ) + 400,
        ( Math.floor( i / 5 ) ) * 300 - 400
      ]
    });

    modes.grid.push(node);
  }

  transform(modes.grid2d, 2000);

  function transform(modes, duration) {
    for ( var i = 0; i < children.length; i ++ ) {
      var node = children[i];
      var target = modes[i];

      node.setProperties({
        position: [target.position.x, target.position.y, target.position.z],
        rotation: [target.rotation.x, target.rotation.y, target.rotation.z],
        scale: [target.scale.x, target.scale.y, target.scale.z],
        opacity: 1
      }, {
        duration: Math.random() * duration + duration,
        curve: 'ExponentialIn'
      });
    }
  }

  var text = {
    device: 'iPhone',
    layout: 'Exploding View',
    featureSpacing: 200,
    viewSpacing: 200,
    showLinks: false,
    showDevice: false
  }

  var gui = new dat.GUI();

  var device = gui.add(text, 'device', [ 'iPhone', 'iPad', 'Android Phone', 'Android Tablet', 'Windows Phone', 'Windows Tablet', 'Desktop'] );
  device.onChange(function(value) {

  });

  var layout = gui.add(text, 'layout', [ 'Table View', 'Grid View', 'Exploding View', 'Sphere View', 'Helix View', 'UX Flow View' ] );
  layout.onChange(function(value) {
    if (value == "Exploding View")
      transform(modes.grid, 1000);
    else if (value == 'Table View')
      transform(modes.table, 1000);
    else if (value == 'Grid View')
      transform(modes.grid2d, 1000);
    else if (value == 'Helix View')
      transform(modes.helix, 1000);
    else if (value == 'Sphere View')
      transform(modes.sphere, 1000);

  });

  gui.add(text, 'featureSpacing', 100, 300);
  gui.add(text, 'viewSpacing', 100, 300);
  gui.add(text, 'showLinks');
  gui.add(text, 'showDevice');
})

import Node from '../src/core/Node.js';
import Component from '../src/components/Component';
import FrameLoop from '../src/core/FrameLoop';
import Position from '../src/components/Position';
import DOMElement from '../src/components/DOMElement';
import Vec3 from '../src/util/Vec3';

// I'm at a complete loss as to why variables declared in
// this scope aren't declared inside the functions below.
famin = { Node, Component, FrameLoop, DOMElement, Vec3 };

suite('Render test', function() {
  benchmark('200 transitionables', function() {
    this.loop.step();
  });
}, {
  setup: function() {
    this.loop = famin.Component.loop = new famin.FrameLoop();
    var num = 1;

    for (var i=0; i < num; i++) (function(i) {
      console.log('i1', i);
      var node = famin.Node.instance();
      console.log(1);
      node.addComponents('domElement', 'position');
      console.log(2);
      node.position.set(randomPosition());
      node.size.setAbsolute(50,50,0);
      node.domElement.setClassName('mary');
      node.domElement.setProperty('background',
        'hsla(' + (360/num*i) + ', 100%, 50%, 0.8)');
      console.log(1);

      var toRandomPosition = function() {
        node.position.set(
          randomPosition(),
          { curve: 'inOutElastic', duration: 500 + Math.random() * 1500 },
          toRandomPosition
        );
      };
      toRandomPosition();
      console.log('i', i);
    })(i);
  }
});

/*
describe('Render test', function() {

  beforeEach(function() {
    this.loop = Component.loop = new FrameLoop();
    var num = 200;

    var width = window.innerWidth, height = window.innerHeight;

    var randomPosition = function() {
      return Vec3(
        Math.random() * (width - 50),
        Math.random() * (height - 50),
        (Math.random() * 1000) - 500
      );
    };

    for (var i=0; i < num; i++) (function(i) {
      var node = Node.instance();
      node.addComponents('domElement', 'position');
      node.position.set(randomPosition());
      node.size.setAbsolute(50,50,0);
      node.domElement.setClassName('mary');
      node.domElement.setProperty('background',
        'hsla(' + (360/num*i) + ', 100%, 50%, 0.8)');

      var toRandomPosition = function() {
        node.position.set(
          randomPosition(),
          { curve: 'inOutElastic', duration: 500 + Math.random() * 1500 },
          toRandomPosition
        );
      };
      toRandomPosition();
    })(i);
  });

  it('200 renderables, 600 frames("10s")', function() {
    for (var i=0; i < 600; i++)
      this.loop.step(i);
  });

});
*/
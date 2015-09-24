import Node from './core/Node';
import FrameLoop from './core/FrameLoop';

import Component from './components/Component';
import DOMElement from './components/DOMElement';
import Position from './components/Position';

var dispatcher;
var workers = [];
var workerCount = 1;  // myself
var iam;

var frameLoop = Component.loop = new FrameLoop();
frameLoop._lastFrameStart = performance.now();

// need some adjustment for number of workers
var THRESHOLD = 5;

var map = {};

self.onmessage = function(e) {

  if (typeof e.data === 'object') {

    if (e.data.b) {

      //console.log(e.data.b);

      if (e.data.b.create) {

        var create = e.data.b.create, len = create.length;
        for (var i=0; i < len; i++) {
          var node = Node.instance();
          node.id = create[i];
          map[node.id] = node;
        }

      } 

      if (e.data.b.components) {

        var components = e.data.b.components, len = components.length;
        for (var i=0; i < len; i++) {
          var id = components[i][0];
          var comps = components[i].slice(1);
          map[id].addComponents.apply(map[id], comps);
        }

      }

      if (e.data.b.position) {

        var positions = e.data.b.position, len = positions.length;
        for (var i=0; i < len; i++) {
          var id = positions[i][0];
          var poses = positions[i].slice(1);
          map[id].position.set.apply(map[id].position, poses);
        }

      }

    }

    step(e.data.ts);

  } else if (e.data.substr(0, 6) === 'worker') {

    var num = parseInt(e.data.substr(7));
    workerCount++;
    workers[num] = e.ports[0];
    workers[num].onmessage = function() {
      console.log('worker#' +iam + ' got message from worker#' + num + ':', e.data);
    }

  } else if (e.data.substr(0, 10) === 'dispatcher') {

    iam = parseInt(e.data.substr(11));

    dispatcher = e.ports[0];
    dispatcher.onMessage = function(e) {
      console.log('worker#' + iam + ' got from dispatcher', e);
    }

  } else {

    console.log('worker#' + iam + ' got unknown ', e.data, e);

  }
}

/*
setTimeout(function() {
  if (iam === 2) {
    console.log('2 trying to send to 1');
    workers[1].postMessage('moo');
  }
}, 1000);
*/


var i =0;

var step = function(timestamp) {
  //if (i++ > 5) return;

  var start = performance.now();

  // don't bother
  if (start > timestamp + 2000)
    return;

  frameLoop.step(timestamp);

  var obj = {};
  var transferables = [];

  for (var key in obj)
    obj[key] = null;

  for (var comp in Component._registered) {
    Component._registered[comp].runUpdates(timestamp, obj, transferables);
  }

  postMessage(obj);

  //var now = performance.now();
  //console.log('Worker ' + iam + ' flushed in ' + (now - start) +
  //  'ms, ' + (now - timestamp) + 'ms after frame');

};

postMessage('loaded');

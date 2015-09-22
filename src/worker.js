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

  if (typeof e.data === 'number') {

    step(e.data);

  } else if (e.data.substr(0, 5) === 'node ') {

    var node = Node.instance();
    node.id = e.data.substr(5);
    map[node.id] = node;

  } else if (e.data.substr(0, 14) === 'addComponents ') {

    var data = e.data.split(' ');
    var id = data[1];
    var components = data.slice(2);
    map[id].addComponents.apply(map[id], components);

  } else if (e.data.substr(0, 13) === 'position set ') {

    var data = e.data.split(' ');
    var id = data[2];
    var args = Object.values(JSON.parse(data.slice(3))); // 3 for "position set "
    map[id].position.set.apply(map[id].position, args);
    //console.log(map[id].position);

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
var obj = {
  type: 'DOMEL_TRANSFORM',
  transforms: null
}
;
var step = function(timestamp) {
  //if (i++ > 5) return;

  var start = performance.now();

  // don't bother
  if (start > timestamp + 2000)
    return;

  frameLoop.step(timestamp);

  for (var comp in Component._registered) {
    Component._registered[comp].runUpdates();
  }
  for (var comp in Component._registered) {
    Component._registered[comp].runUpdates();
  }

  //var now = performance.now();
  //console.log('Worker ' + iam + ' flushed in ' + (now - start) +
  //  'ms, ' + (now - timestamp) + 'ms after frame');

};

postMessage('loaded');

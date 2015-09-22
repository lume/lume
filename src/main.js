import UUID from './util/UUID';
import log from './util/log';
log.level = 'trace';

// todo, autodetect
var WORKERS = 2;
var workerCount = 0;

var start = performance.now();

var workers = new Array(WORKERS);
var channels = new Array(WORKERS);
var dchans = new Array(WORKERS);

var dispatcher = new Worker('dispatcher.js');
dispatcher.onmessage = function(e) {
  // probably UI will never get messages from dispatcher?
  console.log('got unknown ' + e.data + ' from dispatcher');
}

var domMap = new Array(WORKERS);

var i, j;

/* will require changes in systemjs
var urlStart = location.href.substr(0, location.href.length - location.hash.length);
var workerBlob = URL.createObjectURL( new Blob( [
  "self.importScripts(" +
    "'" + urlStart + "jspm_packages/system.js', " +
    "'" + urlStart + "config.js'" +
  ");" +
  "System.config({ baseURL: '" + urlStart + "' });" +
  "System.import('worker');"
], { type: 'application/javascript' } ));
*/

log.debug('Spinning up ' + WORKERS + ' workers (besides dispatcher)');
for (i=0; i < WORKERS; i++) {
  workers[i] = new Worker('worker_loader.js' /* workerBlob */);
  workers[i].onmessage = (function(i) { return function workerMessage(e) {
    window.onmessage.call(window, e, i);
  } })(i);
  domMap[i] = [];
}

//URL.revokeObjectURL( workerBlob );

function setupMessaging() {

  for (i=0; i < WORKERS; i++) {
    dchans[i] = new MessageChannel();
    dispatcher.postMessage('worker ' + i, [dchans[i].port1]);
    workers[i].postMessage('dispatcher ' + i, [dchans[i].port2]);

    for (j=0; j < WORKERS; j++) {
      var chan = new MessageChannel();
      workers[i].postMessage('worker ' + j, [chan.port1]);
      workers[j].postMessage('worker ' + i, [chan.port2]);
    }
  }

}

//window.faminWorkers = workers;
var transformQueue, elementQueue;

window.onmessage = function onmessage(e, workerNo) {
  if (typeof e.data === 'object') {

    if (e.data.type === 'MATRIX') {

      var arr = new Float32Array(e.data.matrixQueue);
      for (var i=0, len=arr.length; i < len; i+= 17) {
        var id = arr[i+16];

        // XXXX only necessary because of transform bug
        if (!id) break; 

        var transform = 'matrix3d(' +
          arr[i+0] + ',' + arr[i+1] + ',' + arr[i+2] + ',' + arr[i+3] + ',' +
          arr[i+4] + ',' + arr[i+5] + ',' + arr[i+6] + ',' + arr[i+7] + ',' +
          arr[i+8] + ',' + arr[i+9] + ',' + arr[i+10] + ',' + arr[i+11] + ',' +
          arr[i+12] + ',' + arr[i+13] + ',' + arr[i+14] + ',' + arr[i+15] + ')';
        domMap[workerNo][id].style.transform = transform;
      }      

    }

  } else if (e.data === 'loaded') {

    if (++workerCount === WORKERS) {
      log.debug('All ' + WORKERS + ' workers ready after ' +
        (performance.now() - start) + 'ms');
      setupMessaging();
      //window.setTimeout(begin, 1000); // let settle
      window.requestAnimationFrame(rafLoop);
    }

  } else if (e.data.substr(0, 6) === 'DOMEL ') {

    var data = e.data.split(' ');
    var cmd = data[1];
    var id = data[2];

    if (cmd === 'CREATE') {
      var el = domMap[workerNo][id] = document.createElement(data[3]);
      el.style.position = 'absolute';
      el.style.width = '50px';
      el.style.height = '50px';
      el.style.background = 'red';
      el.style.position = 'absolute';
      el.className = 'mary';
      document.body.appendChild(el);
    } else if (cmd === 'TRANSFORM') {
      var transform = JSON.parse(data[3]);
      domMap[workerNo][id].style.transform = 'matrix3d(' + transform.join(',') + ')';
      //transformQueue.push(domMap[id], transform);
      //console.log('add to queue at ' + performance.now());

    } else if (cmd === 'TRANSFORM1') {

      var arr = JSON.parse(data[2]);
      for (var i=0, len=arr.length; i < len; i+= 17) {
        var id = arr[i+16];
        var transform = 'matrix3d(' +
          arr[i+0] + ',' + arr[i+1] + ',' + arr[i+2] + ',' + arr[i+3] + ',' +
          arr[i+4] + ',' + arr[i+5] + ',' + arr[i+6] + ',' + arr[i+7] + ',' +
          arr[i+8] + ',' + arr[i+9] + ',' + arr[i+10] + ',' + arr[i+11] + ',' +
          arr[i+12] + ',' + arr[i+13] + ',' + arr[i+14] + ',' + arr[i+15] + ')';
        domMap[workerNo][id].style.transform = transform;
      }

    } else {
      console.log('unknown dom ' + cmd);
    }

  } else {

    console.log('ui got unknown ', e.data, e);

  }
}

function n2w(id) {
  return id.charCodeAt(0) % WORKERS;
}

class Node {
  constructor() {
    this.id = UUID.generate();
    this.worker = workers[n2w(this.id)];
    this.worker.postMessage('node ' + this.id);
    this.position = new Position(this);
  }
  addComponents() {
    this.worker.postMessage('addComponents ' +
      this.id + ' ' +
      Array.prototype.slice.call(arguments).join(' '));
  }
}

class Position {
  constructor(node) {
    this._node = node;
  }
  set() {
    this._node.worker.postMessage('position set ' +
      this._node.id + ' ' + JSON.stringify(arguments));
  }
}

var transformQueue = [], last = 0;
function rafLoop(timestamp) {
  for (i=0; i < WORKERS; i++)
    workers[i].postMessage(timestamp);

  /*
  if (timestamp < 10000) {
  }

  if (transformQueue.length) {
    for (var i=0, len = transformQueue.length; i < len; i+=2) {
      //console.log('deshift at ' + performance.now());
      var el = transformQueue[i];
      var transform = transformQueue[i+1];
      el.style.transform = 'matrix3d(' + transform.join(',') + ')';

      //console.log(i, 'raf', timestamp, timestamp - last);
      last = timestamp;
    }
    transformQueue.length = 0;
  }
  */

  window.requestAnimationFrame(rafLoop);
};

function begin() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  for (var i=0; i < 100; i++)
    (function(i) {
      var node = new Node();
      node.addComponents('domElement', 'position');
      node.position.set(0, 0, 0);
      setTimeout(function() { 
        node.position.set(
          Math.random()*(width - 50),
          Math.random()*(height - 50),
          0,
          { duration: 1000+Math.random()*1500, curve: 'inOutBounce' }
        );
      }, Math.random() * 2000); 
    })(i);      
}

window.famin = {
  Node,
  UUID,
  begin
}

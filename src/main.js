import UUID from './util/UUID';
import log from './util/log';
import SinglyLinkedList from './util/SinglyLinkedList';
import Vec3 from './util/Vec3';
log.level = 'trace';

// todo, autodetect
var WORKERS = 1;
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

var timeoutQueue = SinglyLinkedList();
function setTimeout(func, time) {
  timeoutQueue.push(Vec3(func, performance.now() + time));
}
function runTimeouts(timestamp) {
  if (!timeoutQueue.head)
    return;

  var now = performance.now();
var i = 0;
  var current, prev;
  for (current = timeoutQueue.head; current; prev = current, current = current.next) {
    i++;
    if (current.data[1] < now) {
      current.data[0]();
    }
    else
      break;
  }

  if (prev)
    timeoutQueue.recycleUntil(prev);
}


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
var i, j;
for (i=0; i < WORKERS; i++) {
  workers[i] = new Worker('worker_loader.js' /* workerBlob */);
  workers[i].onmessage = (function(i) { return function workerMessage(e) {
    window.onmessage.call(window, e, i);
  }; })(i);
  domMap[i] = [];
}

//URL.revokeObjectURL( workerBlob );

function setupMessaging() {
  var i, j;

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

var queue = new Array(50);
var queueLength = 0;
var queueIndex = 0;
var queueTaskIndex = 0;
window.x = { queue, queueLength, queueIndex, queueTaskIndex };

function dequeue(_timestamp) {
  if (workerWaitCount !== WORKERS)
    return true;

  var timestamp = _timestamp || lastTimestamp;
  var threshold = timestamp + 2;
  //console.log('queueIndex', queueIndex, 'queueLength', queueLength, 'queueTaskIndex', queueTaskIndex);

  for (; queueIndex < queueLength; queueIndex += 3) {
    queueTaskIndex =
      dequeue[ queue[queueIndex] ](
        threshold,
        queueTaskIndex,
        queue[queueIndex+1],
        queue[queueIndex+2]
      );

    if (queueTaskIndex) {
//      console.log('not complete')
//      window.requestAnimationFrame(rafLoop);
      return false;
    }
  }

  queueIndex = 0;
  queueLength = 0;

  //console.log('complete');
  //runTimeouts(timestamp);
  window.requestAnimationFrame(rafLoop);  

  return true;
}

dequeue.DOMEL_TRANSFORM = function(threshold, queueTaskIndex, workerNo, data) {
  var arr = new Float32Array(data);

  for (var i=queueTaskIndex||0, len=arr.length; i < len; i+= 17) {
    //if (i % 85 === 0 && performance.now() > threshold) {
    //  return i;
    //}

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
};

window.onmessage = function onmessage(e, workerNo) {
  if (typeof e.data === 'object') {

    workerWaitCount++;
    for (var key in e.data) {

      queue[queueLength] = key;
      queue[queueLength+1] = workerNo;
      queue[queueLength+2] = e.data[key];
      queueLength += 3;

    }
    dequeue();

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
      el.style.background = 'hsl(' + Math.floor(Math.random() * 360) + ', 100%, 50%)';
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

var lastTimestamp, workerWaitCount = WORKERS;
function rafLoop(timestamp) {
  var i;

  lastTimestamp = timestamp;

  if (workerWaitCount === WORKERS) {

    if (queueLength === 0) {

      workerWaitCount = 0;
      for (i=0; i < WORKERS; i++)
        workers[i].postMessage(timestamp);
      
      runTimeouts(timestamp);

    } else {

      if (dequeue(timestamp))
        runTimeouts(timestamp);

    }

  }

};

function begin() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  for (var i=0; i < 50; i++)
    (function(i) {
      var node = new Node();
      node.addComponents('domElement', 'position');
      node.position.set(0, 0, 0);
      var anim = function() { 
        var duration = 1000+Math.random()*1500; 
        node.position.set(
          Math.random()*(width - 50),
          Math.random()*(height - 50),
          Math.random()*1000 - 500,
          { duration: duration, curve: 'inOutCubic' }
        );
        setTimeout(anim, duration);
      };
      setTimeout(anim, Math.random()*1500 + 500);
    })(i);      
}

window.famin = {
  Node,
  UUID,
  begin
};
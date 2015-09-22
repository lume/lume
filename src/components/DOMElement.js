import Component from './Component';
import Vec3 from '../util/Vec3';
import trash from '../util/Trash';
import Pool from '../util/Pool';
import Messaging from '../core/Messaging';
import Event from '../util/Event';
import Size from '../components/Size';
import Transform from '../components/Transform';
import UUID from '../util/UUID';

var elementCount = 0;
var elementMap = [];

Event.register('DOMEL_CREATE', 'DOMEL_SIZE', 'DOMEL_CLASSNAME',
  'DOMEL_TRANSFORM', 'DOMEL_PROPERTY');

var DOMElement = Component.extend({

  name: 'domElement',

  init: function() {
    this._init();

    this._elementId = ++elementCount;
    //this._elementId = UUID.generate();
    elementMap[this._elementId] = this;


    this._className = '';
    this._style = {};
    this._styleUpdated = {};

    // sends DOMEL_CREATE
    this.requestUpdate();
  },

  onAttach: function() {
    this.requires('size', 'transform');
  },

  setClassName: function(className) {
    if (className !== this._className) {
      this._className = className;
      this._classNameUpdated = true;
    }
  },

  setProperty(prop, value) {
    if (this._style[prop] !== value) {
      this._style[prop] = value;
      this._styleUpdated[prop] = value;
    }
  },

  update: function() {
    if (!this._created) {
      this._created = true;
      //Messaging.toUI(Event.DOMEL_CREATE, this._elementId, 'DIV');
      postMessage('DOMEL CREATE ' + this._elementId + ' ' + 'DIV');
    }

    if (this._classNameUpdated) {
      this._classNameUpdated = false;
      Messaging.toUI(Event.DOMEL_CLASSNAME, this._elementId, this._className);
    }

    if (this._styleUpdated) {
      Messaging.toUI(Event.DOMEL_PROPERTY, this._elementId, this._styleUpdated);
      this._styleUpdated = {};
    }

    if (this._matrixChanged) {
      var system = this.__proto__.constructor;
      this._matrixChanged = false;
      system.addMatrixChange(this._elementId, this._matrix);
    }

    this._update();
  },

  onEvent: function(event, sender) {
    this._onEvent(event, sender);

    switch(event) {

      case Event.SIZE_CHANGE:
        Messaging.toUI(Event.DOMEL_SIZE, this._elementId, sender._size);
        break;

      /*
       * Actually need to refactor this; we should allow components to have
       * a 'type' and actually the Transform component should emit a
       * TRANSFORM_CHANGE to the UI thread if any 'renderers' are registered
       * on that node.  But this is ok for now.
       */
      case Event.TRANSFORM_CHANGE:
        //Messaging.toUI(Event.DOMEL_TRANSFORM, this._elementId, sender._matrix);

//        postMessage('DOMEL TRANSFORM ' + this._elementId + ' ' +
  //        JSON.stringify(sender._matrix));

        // temporary!
        this._matrixChanged = true;
        this._matrix = sender._matrix;
        this.requestUpdate();

break;
/*
        var i = DOMElement.queue.length;
        DOMElement.queue[i+0] = sender._matrix[0];
        DOMElement.queue[i+1] = sender._matrix[1];
        DOMElement.queue[i+2] = sender._matrix[2];
        DOMElement.queue[i+3] = sender._matrix[3];
        DOMElement.queue[i+4] = sender._matrix[4];
        DOMElement.queue[i+5] = sender._matrix[5];
        DOMElement.queue[i+6] = sender._matrix[6];
        DOMElement.queue[i+7] = sender._matrix[7];
        DOMElement.queue[i+8] = sender._matrix[8];
        DOMElement.queue[i+9] = sender._matrix[9];
        DOMElement.queue[i+10] = sender._matrix[10];
        DOMElement.queue[i+11] = sender._matrix[11];
        DOMElement.queue[i+12] = sender._matrix[12];
        DOMElement.queue[i+13] = sender._matrix[13];
        DOMElement.queue[i+14] = sender._matrix[14];
        DOMElement.queue[i+15] = sender._matrix[15];

        DOMElement.queue[i+16] = this._elementId;
        break;
*/
    }
  }

});

DOMElement.autoListen = [ Event.SIZE_CHANGE, Event.TRANSFORM_CHANGE ];

DOMElement.preUpdates = function() {
  // this is WRONG, but ok for now... need to track matrix updates separately
  this._matrixQueue = new Float32Array(this._updateQueueCount * 17);
  this._matrixQueueLength = 0;
}

var matrixMsg = { type: 'MATRIX', matrixQueue: null };
DOMElement.postUpdates = function() {
  matrixMsg.matrixQueue = this._matrixQueue.buffer;
  postMessage(matrixMsg, [ matrixMsg.matrixQueue ]);
}

DOMElement.addMatrixChange = function(id, matrix) {
  var i = this._matrixQueueLength;
  this._matrixQueue[i+0] = matrix[0];
  this._matrixQueue[i+1] = matrix[1];
  this._matrixQueue[i+2] = matrix[2];
  this._matrixQueue[i+3] = matrix[3];
  this._matrixQueue[i+4] = matrix[4];
  this._matrixQueue[i+5] = matrix[5];
  this._matrixQueue[i+6] = matrix[6];
  this._matrixQueue[i+7] = matrix[7];
  this._matrixQueue[i+8] = matrix[8];
  this._matrixQueue[i+9] = matrix[9];
  this._matrixQueue[i+10] = matrix[10];
  this._matrixQueue[i+11] = matrix[11];
  this._matrixQueue[i+12] = matrix[12];
  this._matrixQueue[i+13] = matrix[13];
  this._matrixQueue[i+14] = matrix[14];
  this._matrixQueue[i+15] = matrix[15];

  this._matrixQueue[i+16] = id;
  this._matrixQueueLength += 17;
}

export default DOMElement;

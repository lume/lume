import Component from './Component';
import Vec3 from '../util/Vec3';
import trash from '../util/Trash';
import Pool from '../util/Pool';
import Messaging from '../core/Messaging';
import Event from '../util/Event';
import Size from '../components/Size';
import Transform from '../components/Transform';

var elementCount = 0;
var elementMap = {};

Event.register('DOMEL_CREATE', 'DOMEL_SIZE', 'DOMEL_CLASSNAME',
  'DOMEL_TRANSFORM', 'DOMEL_PROPERTY');

var DOMElement = Component.extend({

  name: 'domElement',

  init: function() {
    this._init();

    this._elementId = ++elementCount;
    elementMap[this._id] = this;

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
    this._update();

    if (!this._created) {
      this._created = true;
      Messaging.toUI(Event.DOMEL_CREATE, this._elementId, 'DIV');
    }

    if (this._classNameUpdated) {
      this._classNameUpdated = false;
      Messaging.toUI(Event.DOMEL_CLASSNAME, this._elementId, this._className);
    }

    if (this._styleUpdated) {
      Messaging.toUI(Event.DOMEL_PROPERTY, this._elementId, this._styleUpdated);
      this._styleUpdated = {};
    }
  },

  onEvent: function(event, sender) {
    this._onEvent(event, sender);

    switch(event) {

      case Event.SIZE_CHANGE:
        Messaging.toUI(Event.DOMEL_SIZE, this._elementId, sender._size);
        break;

      case Event.TRANSFORM_CHANGE:
        Messaging.toUI(Event.DOMEL_TRANSFORM, this._elementId, sender._matrix);
        break;

    }
  }

});

DOMElement.autoListen = [ Event.SIZE_CHANGE, Event.TRANSFORM_CHANGE ];

export default DOMElement;

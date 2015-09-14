import Size from '../components/Size';
import Messaging from '../core/Messaging';
import Event from '../util/Event';
import DOMElement from '../components/DOMElement';
import SinglyLinkedList from '../util/SinglyLinkedList';

var DOMRenderer = {

};

var map = DOMRenderer.map = [];
var data = DOMRenderer.data = [];

var readQueue = SinglyLinkedList();
var readRequested = false;

function read() {}

Messaging.on(Event.DOMEL_CREATE, function(id, tagName) {
  map[id] = document.createElement(tagName);
  map[id].style.position = 'absolute';
  document.body.appendChild(map[id]);
});

Messaging.on(Event.DOMEL_SIZE, function DOMEL_SIZE(id, size) {
  map[id].style.width = size[0] + 'px';
  map[id].style.height = size[1] + 'px';
});

Messaging.on(Event.DOMEL_CLASSNAME, function DOMEL_CLASSNAME(id, className) {
  map[id].className = className;
});

Messaging.on(Event.DOMEL_TRANSFORM, function DOMEL_TRANSFORM(id, transform) {
  map[id].style.transform = 'matrix3d(' + transform.join(',') + ')';
});

Messaging.on(Event.DOMEL_PROPERTY, function DOMEL_PROPERTY(id, dict) {
  for (var prop in dict)
    map[id].style[prop] = dict[prop];
});


export default DOMRenderer;
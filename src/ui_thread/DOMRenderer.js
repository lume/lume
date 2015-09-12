import Size from '../components/Size';
import Messaging from '../core/Messaging';
import Event from '../util/Event';
import DOMElement from '../components/DOMElement';
import SinglyLinkedList from '../util/SinglyLinkedList';

var DOMRenderer = {

};

var map = DOMRenderer.map = [];

var readQueue = SinglyLinkedList();
var readRequested = false;

function read() {}

Messaging.on(Event.DOMEL_CREATE, function(id, tagName) {
  map[id] = document.createElement(tagName);
  document.body.appendChild(map[id]);
});

Messaging.on(Event.DOMEL_SIZE, function(id, size) {
  map[id].style.width = size[0] + 'px';
  map[id].style.height = size[1] + 'px';
});

Messaging.on(Event.DOMEL_CLASSNAME, function(id, className) {
  map[id].className = className;
});

Messaging.on(Event.DOMEL_TRANSFORM, function(id, transform) {
  map[id].style.transform = 'matrix3d(' + transform.join(',') + ')';
});

export default DOMRenderer;
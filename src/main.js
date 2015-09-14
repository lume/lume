import log from './util/log';
import rafLoop from './core/rafLoop';
import Node from './core/Node';
import FrameLoop from './core/FrameLoop';
import Messaging from './core/Messaging';

import SinglyLinkedList from './util/SinglyLinkedList';
import trash from './util/Trash';
import Vec3 from './util/Vec3';
import Event from './util/Event';

import Component from './components/Component';
import Size from './components/Size';
import Position from './components/Position';
import Transform from './components/Transform';
import DOMElement from './components/DOMElement';

import DOMRenderer from './ui_thread/DOMRenderer';

import Transitionable from './famous/Transitionable';
import Curves from './famous/Curves';

// for everything in a single thread
Component.loop = rafLoop;
rafLoop.onFinish = function() {
  Messaging.flush();
}
rafLoop.start();

console.log("Try \"famin.util.log.level = famin.util.log.level === 'debug' " +
  "? 'trace' : 'debug';\" to toggle between the two lowest log levels.");

var famin = {

  core: {
    rafLoop,
    Node,
    FrameLoop,
    Messaging
  },

  util: {
    log,
    SinglyLinkedList,
    trash,
    Vec3,
    Event
  },

  components: {
    Component,
    Size,
    Position,
    Transform,
    DOMElement
  },

  transitions: {
    Transitionable,
    Curves
  },

  ui_thread: {
    DOMRenderer
  }
};

// global export? :)
window.famin = famin;

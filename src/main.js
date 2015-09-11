import log from './util/log';
import rafLoop from './core/rafLoop';
import Node from './core/Node';
import FrameLoop from './core/FrameLoop';

import SinglyLinkedList from './util/SinglyLinkedList';
import trash from './util/Trash';
import Vec3 from './util/Vec3';

import Component from './components/Component';
import SizeComponent from './components/SizeComponent';

rafLoop.start();

var famin = {

  core: {
    rafLoop,
    Node,
    FrameLoop
  },

  util: {
    log,
    SinglyLinkedList,
    trash,
    Vec3
  },

  components: {
    Component,
    SizeComponent
  }
};

// global export? :)
window.famin = famin;

import log from './util/log';
import rafLoop from './core/rafLoop';
import Node from './core/Node';

import SinglyLinkedList from './util/SinglyLinkedList';
import trash from './util/Trash';
import Vec3 from './util/Vec3';

rafLoop.start();

var famin = {

  core: {
    rafLoop: rafLoop,
    Node: Node
  },

  util: {
    log: log,
    SinglyLinkedList: SinglyLinkedList,
    trash: trash,
    Vec3: Vec3
  }
};

// global export? :)
window.famin = famin;

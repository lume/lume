require('babelify/polyfill');

import log from './util/log';
import rafLoop from './rafLoop';

import Node from './Node';

//
import SinglyLinkedList from './util/SinglyLinkedList';
import trash from './util/Trash';
import Vec3 from './util/Vec3';

rafLoop.start();

var famin = {
  rafLoop: rafLoop,
  log: log,
  SinglyLinkedList: SinglyLinkedList,
  trash: trash,
  Vec3: Vec3,
  Node: Node
};

// global export? :)
window.famin = famin;

// purposefully not an ES6 class to allow a prototype method without
// a _classCallCheck.

let listPool = null;
let elementPool = null;

let ListElement = function(data) {
  if (!(this instanceof ListElement)) {
    let el = elementPool && elementPool.shiftElement();
    return el && el.init(data) || new ListElement(data);
  }

  this.init(data);
};

ListElement.prototype.init = function(data) {
  if (this.data) trash(this.data);
  if (this.next) trash(this.next);
  this.data = data;
  this.next = null;
  return this;
};

let SinglyLinkedList = function() {
  if (!(this instanceof SinglyLinkedList)) {
    // called without 'new'
    let list = listPool && listPool.shift();
    return list && list.init() || new SinglyLinkedList();
  }

  // call with 'new', a new instantiation
  this.init();
};

SinglyLinkedList.prototype.init = function() {
  this.head = null;
  this.tail = null;
  this.current = undefined;
  return this;
};

SinglyLinkedList.prototype.reset = function() {
  this.current = this.head;
};

SinglyLinkedList.prototype.getNext = function() {
  var tmp;

  // will be `null` at end of list
  if (this.current === undefined)
    this.current = this.head;

  if (this.current) {
    tmp = this.current;
    this.current = tmp.next;
    return tmp.data;
  }

  return null;
};

SinglyLinkedList.prototype.push = function(data) {
  let el = ListElement(data);

  if (this.head === null)
    this.head = el;
  if (this.tail)
    this.tail.next = el;
  this.tail = el;
};

SinglyLinkedList.prototype.shiftElement = function() {
  if (!this.head)
    return null;

  let el = this.head;
  this.head = el.next;
  return el;
};

SinglyLinkedList.prototype.shift = function() {
  var el = this.shiftElement();
  return el && el.data;
};

/*
 * Call this before dropping your references to a list.  We pool previously
 * created instances and hand them back to you via SingleLinkedList();
 */
SinglyLinkedList.prototype.recycle = function() {
  listPool.push(this);

  // Move all our objects to the object pool
  if (this.head) {
    if (elementPool.tail)
      elementPool.tail.next = this.head;
    else
      elementPool.head = this.head;
    elementPool.tail = this.tail;
    // this.head = this.tail = null; - happens on init
  }
};

SinglyLinkedList.prototype.recycleUntil = function(target) {
  var newList = SinglyLinkedList();

  newList.head = this.head;
  this.head = target.next;

  newList.tail = target;
  target.next = null;

  newList.recycle();
};

/*
 * Oh look!  A data structure that maintains itself with itself ^_^
 */
listPool = SinglyLinkedList();
elementPool = SinglyLinkedList();

let trashList = SinglyLinkedList();
let trash = function(trash) { /* trashList.push(trash); */ };

window.SLL = SinglyLinkedList;
window.SLLtrash = trashList;

export default SinglyLinkedList;
import log from './log';

/*
 * SinglyLinkedList Pool
 *
 * Provides a SinglyLinkedList where both the list and it's elements
 * can be very efficiently recycled (pooled and re-used).  The only
 * garbage is your own stored data!  This is in sharp contrast to
 * arrays, where most array operations - behind the scenes - create
 * an entirely new array, discarding the old one which is ultimately
 * garbage collected.
 *
 * Usage:
 *
 *   let queue = SinglyLinkedList();
 *
 *   // Note, the next line is *not* an anonymous function, it
 *   // was *not* declared / instanatiated inside another
 *   // function.  This has a major impact on performance.
 *
 *   function doSomething(data) { ... }
 *
 *   queue.forEach(doSomething); 
 *
 * Alternatively, you can manipulate the list directly:
 *
 *   for (let current = queue.head; current; current = current.next)
 *     doSomethingWith(current.data);
 *
 * Before dropping a reference to a list, you should call queue.recycle().
 * To recycle a partial list, call queue.recycleUntil(listElement).
 *
 * NB: These are purpusefully not ES6 classes to allow prototype
 * methods without a _classCallCheck.  We handle this ourselves to
 * allow the method to be called without `new` and retrieve
 * recycled lists and elements from the pool, via SinglyLinkedList().
 */

// These will become SinglyLinkedList()'s after the class is defined.
let listPool = null;
let elementPool = null;

/*
 * Supply a clean SinglyLinkedListElement with the given data, from
 * the pool (if a recycled element is available) otherwise from a
 * new instance.  The object looks like this:
 *
 * - data {object} - the data to store
 * - next {SinglyLinkedListElement} - optional reference to next element
 *
 * @param {object} data - the data to store in this element
 * @returns {SinglyLinkedList}
 *
 */
let SinglyLinkedListElement = function(data) {
  if (!(this instanceof SinglyLinkedListElement)) {
    // called without 'new'
    let el = elementPool && elementPool.shiftElement();
    //return el && el.init(data) || new SinglyLinkedListElement(data);
    if (el)
      return el.init(data);
    el = new SinglyLinkedListElement(data);
    log.trace('New SinglyLinkedListElement instance', el);
    return el;
  }
  // call with 'new', a new instantiation
  this.init(data);
};

/*
 * Sets the initial state of an element, called on both new
 * instantiations and recycled elements.  In the case of the
 * latter, where actual garbage is created.
 */
SinglyLinkedListElement.prototype.init = function(data) {
  if (this.data)
    trash(this.data);

  this.data = data;
  this.next = null;  // recycled
  return this;
};

/*
 * Supplies a clean SinglyLinkedList, from the pool if a recycled list
 * is available, else from a new instance.  The object looks like this:
 *
 * - head {SinglyLinkedListElement} - the head / beginning / 1st element
 * - tail {SinglyLinkedListElement} - the tail / end / last element
 * - current {SinglyLinkedListElement} - current index for getNext()
 * 
 * @returns {SinglyLinkedList}
 */
let SinglyLinkedList = function() {
  if (!(this instanceof SinglyLinkedList)) {
    let list = listPool && listPool.shift();
    //return list && list.init() || new SinglyLinkedList();
    if (list)
      return list.init();
    list = new SinglyLinkedList();
    log.trace('New SinglyLinkedList instance', list);
    return list;
  }
  this.init();
};

SinglyLinkedList.prototype.init = function() {
  this.head = null;
  this.tail = null;
  this.current = undefined;
  return this;
};

/*
 * Reset the "current" index of the list to the beginning / head,
 * for use with getNext()
 */
SinglyLinkedList.prototype.reset = function() {
  this.current = this.head;
};

/*
 * Returns the data of the next element in the list, or the first
 * element if it has never been called before.  The index can be
 * reset with the reset() method.
 */
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

/*
 * Push data to the end / tail of the list
 * @param {object} data - the data to store
 */
SinglyLinkedList.prototype.push = function(data) {
  let el = SinglyLinkedListElement(data);

  if (this.head === null)
    this.head = el;
  if (this.tail)
    this.tail.next = el;
  this.tail = el;
};

/*
 * Returns and removes the first ELEMENT (not data) in the list.
 * Use shift() to get the actaul data.
 *
 * @returns {SinglyLinkedListElement} - the first element / head of the list.
 */
SinglyLinkedList.prototype.shiftElement = function() {
  if (!this.head)
    return null;

  let el = this.head;
  this.head = el.next;
  if (!el.next)
    this.tail = null;

  return el;
};

/*
 * Removes the first element of the list and returns it's data.
 * Use shiftElement() to get the actual element.
 *
 * @returns {object} - the data stored in the first element
 */
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
    if (elementPool.tail) {
      elementPool.tail.next = this.head;
      elementPool.tail = this.tail;
    } else {
      elementPool.head = this.head;
      elementPool.tail = this.tail;
    }
    // this.head = this.tail = null; - happens on init
  }
};

/*
 * Instead of recycling the entire list, this will recycle all the
 * elements from the head of a list up to and including the given element.
 *
 * @param {SinglyLinkedListElement} target - element to recycle up to (inclusive)
 */
SinglyLinkedList.prototype.recycleUntil = function(target) {
  // Move all our objects to the object pool
  if (elementPool.tail) {
    elementPool.tail.next = this.head;
    elementPool.tail = target;
  } else {
    elementPool.head = this.head;
    elementPool.tail = target;
  }
  this.head = target.next;
  target.next = null;
  if (this.tail === target)
    this.tail = null;

  /*
  var newList = SinglyLinkedList();

  newList.head = this.head;
  this.head = target.next;
  if (this.tail === target)
    this.tail = null;

  newList.tail = target;
  target.next = null;

  newList.recycle();
  */
};

/*
 * Get the data from the given index.  Computationally expensive.  Useful
 * for testing, but if you find yourself using this often, consider using
 * a regular array.
 *
 * @param {number} index - the index to retrieve
 * @returns {mixed} - the data at this index
 */
SinglyLinkedList.prototype.get = function(index) {
  for (var i=0, current=this.head; current; i++, current=current.next)
    if (i === index) return current.data;
  return null;
};

/*
 * Builds and returns an array version of the list.  Computationally
 * expensive, useful for testing, but if you find yourself using this
 * often, consider using a regular array.
 */
SinglyLinkedList.prototype.toArray = function(index) {
  var arr = [];
  for (var current = this.head; current; current = current.next)
    arr.push(current.data);
  return arr;
};

/*
 * Cheaply iterates over data in the list using the given
 * function.  For high traffic, ensure the function is
 * declared once, permanently, and not constructed inside
 * of another function each time you need it.  If the
 * function returns `false`, we'll break and stop iterating
 * over the list.
 *
 * @param {function} func - the funtion to run, called as
 *                          func(data).  may return `false`
 *                          to break the loop.
 */
SinglyLinkedList.prototype.forEach = function(func, context, data) {
  for (var current = this.head; current; current = current.next)
    if (func.call(context, current.data, data) === false) break;
};

/*
 * If your list contains just functions, this is a shortcut to
 * run them all.
 */
SinglyLinkedList.prototype.forEachCall = function(context, arg) {
  for (var current = this.head; current; current = current.next)
    current.data.call(context, arg);
};

/*
 * Oh look!  A data structure that maintains itself with itself ^_^
 */
listPool = SinglyLinkedList();
elementPool = SinglyLinkedList();

// to avoid a circular dependency, let's set this up later & optionally
let trash = function() { };
SinglyLinkedList.prototype.setTrashFunc = function(func) {
  trash = func;
}

// useful for testing
SinglyLinkedList._setListPool = function(_listPool) { listPool = _listPool; }
SinglyLinkedList._setElementPool = function(_elementPool) { elementPool = _elementPool; }

export default SinglyLinkedList;
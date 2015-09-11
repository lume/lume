import SinglyLinkedList from '../util/SinglyLinkedList';

class GenericSystem {

  constructor() {
    this._pool = SinglyLinkedList();

    /*
     * A list of all active components.  The traditional
     * entity-component-system model loops through all
     * registered components continuously, but we require
     * them to request an update or recompute via
     * cascading dependency updates.
     */
    // this._components = DoublyLinkedList();

    this._updateQueue = SinglyLinkedList();
    this._nextUpdateQueue = SinglyLinkedList();

    this._inUpdate = false;
  }

  requestUpdate(component) {
    if (this._inUpdate)
      this._nextUpdateQueue.push(component);
    else
      this._updateQueue.push(component);
  }

  runUpdates() {
    var head = this._updateQueue.head;
    if (head) {

      this._inUpdate = true;

      // Iterate through all components (that are attached to)
      for (let current = head; current; current = current.next)
        current.data._node && current.data.update();

      this._inUpdate = false;

    }

    this._updateQueue.recycle();
    this._updateQueue = this._nextUpdateQueue;
    this._nextUpdateQueue = SinglyLinkedList();
  }

}

export default GenericSystem;

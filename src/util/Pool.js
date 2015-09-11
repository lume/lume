import SinglyLinkedList from './SinglyLinkedList';

let Pool = {

  extend: function(Object) {
    let pool = SinglyLinkedList();

    Object.instance = function(options) {
      let obj = pool.shiftElement();
      return obj && obj.init(options) || new Object(options, true);
    }

    // mmmm...?
    var origRecycle = Object.prototype.recycle;
    Object.prototype.recycle = function() {
      if (origRecycle)
        origRecycle.call(this);
      pool.push(this);
    }

  }

};

export default Pool;
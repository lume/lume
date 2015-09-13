import SinglyLinkedList from './SinglyLinkedList';

describe('SinglyLinkedList', function() {
  beforeEach(function () {
    this.list = new SinglyLinkedList();
  });

  it('should create a SinglyLinkedList instance', function () {
    expect(this.list instanceof SinglyLinkedList).toBe(true);
    expect(this.list.head).toBe(null);
    expect(this.list.tail).toBe(null);
  });

  it('should allow data to be pushed in order', function () {
    this.list.push('A');
    expect(this.list.head.data).toBe('A');
    expect(this.list.head.data).toBe('A');

    this.list.push('B');
    expect(this.list.head.data).toBe('A');
    expect(this.list.tail.data).toBe('B');
    expect(this.list.head.next.data).toBe('B');
    expect(this.list.tail.next).toBe(null);
  });

  it('should be iterable with getNext and reset', function() {
    this.list.push('A');
    this.list.push('B');

    expect(this.list.getNext()).toBe('A');
    expect(this.list.getNext()).toBe('B');
    expect(this.list.getNext()).toBe(null);

    this.list.reset();
    expect(this.list.getNext()).toBe('A');
    expect(this.list.getNext()).toBe('B');
  });

  it('should be shiftable', function() {
    this.list.push('A');
    this.list.push('B');

    var A = this.list.shift();
    expect(A).toBe('A');
    expect(this.list.head.data).toBe('B');
    expect(this.list.tail.data).toBe('B');
  });

  it('should be gettable', function() {
    this.list.push('A');
    this.list.push('B');

    expect(this.list.get(0)).toBe('A');
    expect(this.list.get(1)).toBe('B');
    expect(this.list.get(2)).toBe(null);
  });
});

describe('SinglyLinkedList pooling', function() {

  beforeEach(function() {
    this.listPool = new SinglyLinkedList();
    this.elementPool = new SinglyLinkedList();
    SinglyLinkedList._setListPool(this.listPool);
    SinglyLinkedList._setElementPool(this.elementPool);
  });

  it('should be recyclable', function() {
    expect(this.listPool.head).toBe(null);
    expect(this.elementPool.head).toBe(null);
    expect(this.listPool.tail).toBe(null);
    expect(this.elementPool.tail).toBe(null);

    var list1 = SinglyLinkedList();
    list1.push('A'); list1.push('B');
    list1.recycle();

    expect(this.elementPool.head.data).toBe('A');
    expect(this.elementPool.tail.data).toBe('B');

    var list2 = SinglyLinkedList();
    list2.push('A'); list2.push('B');

    expect(this.listPool.head).toBe(null);
    expect(this.elementPool.head).toBe(null);
    expect(this.listPool.tail).toBe(null);
    expect(this.elementPool.tail).toBe(null);
  });

  it('recycleUntil', function() {
    expect(this.listPool.head).toBe(null);
    expect(this.elementPool.head).toBe(null);
    expect(this.listPool.tail).toBe(null);
    expect(this.elementPool.tail).toBe(null);

    var list1 = SinglyLinkedList();
    list1.push('A'); list1.push('B');
    var elA = list1.head;
    list1.recycleUntil(elA);

    expect(this.elementPool.head.data).toBe('A');
    expect(this.elementPool.tail.data).toBe('A');
    expect(this.elementPool.head.next).toBe(null);
    expect(list1.head.data).toBe('B');
    expect(list1.tail.data).toBe('B');
    expect(list1.tail.next).toBe(null);

    var list2 = SinglyLinkedList();
    list2.push('A2'); list2.push('B2');

    expect(this.listPool.head).toBe(null);
    expect(this.elementPool.head).toBe(null);
    expect(this.listPool.tail).toBe(null);
    expect(this.elementPool.tail).toBe(null);
  });

});

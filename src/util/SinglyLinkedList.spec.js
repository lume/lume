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
    var stats = SinglyLinkedList.stats();
    expect(stats.lists).toBe(0);
    expect(stats.elements).toBe(0);
    expect(stats.pooledLists).toBe(0);
    expect(stats.pooledElements).toBe(0);

    var list1 = SinglyLinkedList();
    list1.push('A'); list1.push('B');

    stats = SinglyLinkedList.stats();
    expect(stats.lists).toBe(1);
    expect(stats.elements).toBe(2);
    expect(stats.pooledLists).toBe(0);
    expect(stats.pooledElements).toBe(0);

    list1.recycle();

    stats = SinglyLinkedList.stats();
    expect(stats.lists).toBe(1);
    expect(stats.elements).toBe(3);  // one to store the recycled List
    expect(stats.pooledLists).toBe(1);
    expect(stats.pooledElements).toBe(2);

    var list2 = SinglyLinkedList();
    list2.push('A'); list2.push('B');

    stats = SinglyLinkedList.stats();
    expect(stats.lists).toBe(1);
    expect(stats.elements).toBe(3);
    expect(stats.pooledLists).toBe(0);
    expect(stats.pooledElements).toBe(1);
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

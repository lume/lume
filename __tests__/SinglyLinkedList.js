jest.dontMock('../lib/util/SinglyLinkedList');

describe('SinglyLinkedList', function() {
  var SinglyLinkedList = require('../lib/util/SinglyLinkedList');

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

/*
 * Output:
 *
 *   Generatic anonymous closure: 160ms  (86% slower)
 *        Reused static function: 86ms   (46% faster)
 *
 * Does not include garbage collection!!
*/

var i, start, queue, dest = { i: 0 }, max=50000;
var func = function(data) { data(dest) };

queue = famin.util.SinglyLinkedList();
start = performance.now();
for (i=0; i < max; i++)
  (function() {
    var x = dest;
    queue.push(function() { x.i++; });
  })();
queue.forEach(func);
console.log(performance.now() - start);

queue = famin.util.SinglyLinkedList();
start = performance.now();
var staticFunc = function(x) { x.i++; };
for (i=0; i < max; i++)
  (function() {
    queue.push(staticFunc);
  })();
queue.forEach(func);
console.log(performance.now() - start);
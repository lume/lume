var workers = [];
var workerCount = 0;

self.onmessage = function(e) {
  if (e.data.substr(0, 6) === 'worker') {

    var num = e.data.substr(7);
    workers[num] = e.ports[0];
    workers[num].onmessage = function(e) {
      console.log('dispatcher got from worker#' + num, e.data, e);
    }
    workerCount++;

  } else {

    if (e.data.substr(0, 4) === 'node') {

      var id = e.data.substr(5);
      var dest = n2w(id);

    } else {

      console.log('dispatcher got from UI', e);

    }

  }
}

/**
* Engine
*
* A simple Rendering Engine that uses requestAnimationFrame to update.
*
* by Steve Belovarich
* Licensed under MIT, see license.txt or http://www.opensource.org/licenses/mit-license.php
**/

var Engine = function(){

    this.time = 0;
    this._worker = null;
    this.updateQueue = [];

}

Engine.prototype.init = function(worker){
    window.requestAnimationFrame(this.tick.bind(this));
    if(worker){
        this._worker = worker;
    }
    if(worker.constructor.name === 'Worker'){
        this._worker.postMessage({init:'done'});
    }
}

Engine.prototype.tick = function(time){

    var item;
    this.time = performance.now();

    if(this._worker.constructor.name === 'Worker'){
      this._worker.postMessage({frame:this.time});
    } else {
      this._worker.tick(time);
    }

    while (this.updateQueue.length) {
      item = this.updateQueue.shift();
      if (item && item.update) item.update(this.time);
      if (item && item.onUpdate) item.onUpdate(this.time);
    }

    window.requestAnimationFrame(this.tick.bind(this));

}


module.exports = new Engine();

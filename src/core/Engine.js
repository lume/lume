var Clock = require('./Clock');

var instance = null;

var Engine = function(){

    this._clock = new Clock();
    this._worker = null;
    this.updateQueue = [];
    this.id = Math.random() * 50000;

    if(!instance){
        instance = this;
    }

    return instance;
}

Engine.prototype.init = function(worker){
    window.requestAnimationFrame(this.tick.bind(this));
    if(worker){
        this._worker = worker;
        this._worker.postMessage({init:'done'});
    }
}

Engine.prototype.tick = function(time){

    var item;
    this._clock.step(time);
    this.time = this._clock.now();

    if(this._worker){
        this._worker.postMessage({frame:this.time});
    }

    while (this.updateQueue.length) {
      item = this.updateQueue.shift();
      console.log(item);
      if (item && item.update) item.update(time);
      if (item && item.onUpdate) item.onUpdate(time);
    }

    window.requestAnimationFrame(this.tick.bind(this));

}


/**
 * Returns the instance of clock used by the FamousEngine.
 *
 * @method
 *
 * @return {Clock} Engine's clock
 */
Engine.prototype.getClock = function() {
    return this._clock;
};

module.exports = new Engine();

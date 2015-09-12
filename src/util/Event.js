var Event = {

  _counter: 0,

  register: function(keyOrArrayOfKeys /*, arguments */) {
    var i;

    if (arguments.length > 1) {

      for (i = 0; i < arguments.length; i++) {
        this[arguments[i]] = this._counter;
        this[this._counter] = arguments[i];
        this._counter++;
      }

    } else if (keyOrArrayOfKeys instanceof Array) {

      for (i = 0; i < keyOrArrayOfKeys.length; i++) {
        this[keyOrArrayOfKeys[i]] = this._counter;
        this[this._counter] = keyOrArrayOfKeys[i];
        this._counter++;
      }

    } else {

      this[keyOrArrayOfKeys] = this._counter;
      this[this._counter] = keyOrArrayOfKeys;
      this._counter++;

    }
    
  }

}

export default Event;

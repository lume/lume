import Component from './Component';
import Messaging from '../core/Messaging';
import Event from '../util/Event';
import Pool from '../util/Pool';
import Vec3 from '../util/Vec3';
import Transitionable from '../famous/Transitionable';

Event.register('POSITION_CHANGE');

var Position = Component.extend({

  name: 'position',

  init: function() {
    this._init();

    this._position = Vec3(0, 0, 0);
  },

  onAttach: function() {
    this.requires('transform');
  },

  set: function(XorVec3, y, z, transition, callback) {
    var argc = arguments.length;
    var vec3 = arguments[0] instanceof Vec3 && arguments[0];
    var callback = typeof arguments[argc-1] === 'function' && arguments[--argc];
    var transition = argc > 1 && typeof arguments[argc-1] === 'object'
      && arguments[argc-1];

    if (vec3) {

      if (transition) {

        // XXX in future we'll get from pool rather than leaving here
        this._transition = this._transition || new Transitionable();
        this._transition
          .from(this._position)
          .to(vec3, transition.curve, transition.duration,
            callback, transition.method);
        this.requestUpdate();

      } else if (!this._position.equals(vec3)) {
        this._position.recycle();
        this._position = vec3;
        this.requestUpdate();
      }

    } else {

      if (transition) {

        // XXX in future we'll get from pool rather than leaving here
        this._transition = this._transition || new Transitionable();
        this._transition
          .from(this._position).to(Vec3(XorVec3,y,z),
            transition && transition.curve,
            transition && transition.duration,
            callback,
            transition && transition.method);
        this.requestUpdate();

      } else {

        for (var i=0; i < arguments.length; i++) {
          if (this._position[i] !== arguments[i]) {
            this._position[i] = arguments[i];
            this.requestUpdate();
          }
        }        

      }


    }
  },

  update: function(data, timestamp) {
    this._update(data, timestamp);

    if (this._transition /* next part until pool ready */ && this._transition._queue.length) {

      var current = this._transition.get(timestamp);

      for (var i=0; i < current.length; i++)
        this._position[i] = current[i];

      if (this._transition._queue.length) {
        this.requestUpdate();
      } else {
        // XXX recycle  this._transition.recycle(); and .to(vec3)
        //delete this._transition;
      }

    }

    //this.emit(Event.POSITION_CHANGE);
    this._node._emit(Event.POSITION_CHANGE, this);
  }

});

export default Position;

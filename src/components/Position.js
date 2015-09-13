import Component from './Component';
import Messaging from '../core/Messaging';
import Event from '../util/Event';
import Pool from '../util/Pool';
import Vec3 from '../util/Vec3';

Event.register('POSITION_CHANGE');

class Position extends Component {

  init() {
    super.init();
    this._position = Vec3(0, 0, 0);
  }

  onAttach() {
    // to avoid circular dependecy; need a better way XXX
    this.requires(famin.components.Transform);
  }

  set(XorVec3, y, z) {
    if (y) {

      for (var i=0; i < arguments.length; i++) {
        if (this._position[i] !== arguments[i]) {
          this._position[i] = arguments[i];
          this.requestUpdate();
        }
      }

    } else {

      if (!this._position.equals(XorVec3)) {
        this._position.recycle();
        this._position = XorVec3;
        this.requestUpdate();
      }

    }
  }

  update() {
    //this.emit(Event.POSITION_CHANGE);
    this._node._emit(Event.POSITION_CHANGE, this);
    super.update();
  }

}

Pool.extend(Position);

export default Position;

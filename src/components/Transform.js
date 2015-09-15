import Component from './Component';
import Messaging from '../core/Messaging';
import Event from '../util/Event';
import Pool from '../util/Pool';
import Position from '../components/Position';

Event.register('TRANSFORM_CHANGE');

class Transform extends Component {

  init() {
    super.init();
    this._matrix = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]; // tmp TODO pool
  }

  onEvent(event, sender) {
    super.onEvent.apply(this, arguments);
    this.requestUpdate();
  }

  update() {
    var node = this._node;
    this._updateRequested = false;

    // TODO compare new matrix

    var position = node.position;
    if (position) {
      this._matrix[12] = position._position[0];
      this._matrix[13] = position._position[1];
      this._matrix[14] = position._position[2];
    } else {
      this._matrix[12] = 0;
      this._matrix[13] = 0;
      this._matrix[14] = 0;
    }

    //this.emit(Event.TRANSFORM_CHANGE);
    this._node._emit(Event.TRANSFORM_CHANGE, this);
  }

}

Transform.autoListen = [ Event.POSITION_CHANGE ];

Component.configure('transform', Transform);

export default Transform;

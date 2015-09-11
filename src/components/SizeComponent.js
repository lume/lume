import Component from './Component';
import Vec3 from '../util/Vec3';
import trash from '../util/Trash';
import Pool from '../util/Pool';

class SizeComponent extends Component {

  init(options) {
    super.init(options);

    this._sizeMode = options && options.sizeMode || Vec3(
      SizeComponent.ABSOLUTE_SIZE,
      SizeComponent.ABSOLUTE_SIZE,
      SizeComponent.ABSOLUTE_SIZE
    );

    this._absoluteSize = options && options.absoluteSize || Vec3(10, 10, 0);

    // The actual, computed, current size.
    this._size = Vec3();
  }

  update() {
    var changed = false;

    for (var i=0; i < this._size.length; i++) {

      switch(this._sizeMode[i]) {

        case SizeComponent.ABSOLUTE_SIZE:
          if (this._size[i] !== this._absoluteSize[i]) {
            this._size[i] = this._absoluteSize[i];
            changed = true;
          }
          break;

      }

    }

    // Must be last; sets _updateRequested=false and notifies observers
    super.update(changed);
  }

  recycle() {
    this._sizeMode.recycle();
    this._absoluteSize.recycle();
    this._size.recycle();
    super.recycle();
  }

  /* CustomComponent specific methods */

  setSizeMode(newSizeMode) {
    if (this._absoluteSize.equal(newSizeMode)) {
      newSizeMode.cycle();
    } else {
      this._sizeMode.recycle();
      this._sizeMode = newSizeMode;
      this.requestUpdate();
    }
  }

  setAbsolute(newSize) {
    if (this._absoluteSize.equal(newSize)) {
      newSize.recycle();
    } else {
      this._absoluteSize.recycle();
      this._absoluteSize = newSize;
      this.requestUpdate();
    }
  }

}

Pool.extend(SizeComponent);

SizeComponent.ABSOLUTE_SIZE = 1;
SizeComponent.RELATIVE_SIZE = 2;
SizeComponent.RENDER_SIZE = 3;

export default SizeComponent;
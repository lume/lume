import Component from './Component';
import Vec3 from '../util/Vec3';
import trash from '../util/Trash';
import GenericSystem from '../systems/GenericSystem';

let SizeComponent = function(options) {
  if (this instanceof SizeComponent) {
    this.init(options);
  } else {
    let size = SizeComponent.system._pool.shiftElement();
    return size && size.init(options) || new SizeComponent(options);
  }
};

SizeComponent.prototype = Object.create(Component.prototype);
SizeComponent.prototype.constructor = SizeComponent;
SizeComponent.prototype.system = new GenericSystem();
SizeComponent.system = SizeComponent.prototype.system;

SizeComponent.ABSOLUTE_SIZE = 1;
SizeComponent.RELATIVE_SIZE = 2;
SizeComponent.RENDER_SIZE = 3;

SizeComponent.prototype.init = function(options) {
  this._sizeMode = options && options.sizeMode || Vec3(
    SizeComponent.ABSOLUTE_SIZE,
    SizeComponent.ABSOLUTE_SIZE,
    SizeComponent.ABSOLUTE_SIZE
  );

  this._absoluteSize = options && options.absoluteSize || Vec3(10, 10, 0);

  // The actual, computed, current size.
  this._size = Vec3();
};

SizeComponent.prototype.setSizeMode = function(sizeMode) {
  this._sizeMode.recycle();
  this._sizeMode = sizeMode;
};

SizeComponent.prototype.setAbsoluteSize = function(size) {
  this._absoluteSize.recycle();
  this._absoluteSize = size;
};

SizeComponent.prototype.update = function() {
  for (var i=0; i < this._size.length; i++) {

    switch(this._sizeMode[i]) {

      case SizeComponent.ABSOLUTE_SIZE:
        this._size[i] = this._desiredSize[i];
        break;

    }

  }
};

export default SizeComponent;
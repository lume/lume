import GenericSystem from '../systems/GenericSystem';
import trash from '../util/Trash';

// Necessary to always override this (replacing "Component")
let Component = function(options) {
  if (this instanceof Component) {
    this.init(options);
  } else {
    let component = Component.system._pool.shiftElement();
    return component && component.init(options) || new Component(options);
  }  
};

Component.prototype.componentName = 'generic';

// What to do on a new or recycled instance
Component.prototype.init = function() {
};

// What to do when an update is called
Component.prototype.update = function() {
};

Component.prototype.requestUpdate = function() {
  this.system.requestUpdate(this);
};

Component.system = new GenericSystem();
Component.prototype.system = Component.system;

export default Component;

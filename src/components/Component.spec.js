import Component from './Component';
import Node from '../core/Node';

describe('Component (unattached)', function() {
  it('should not run updates when not attached to a node', function() {

  });
});

describe('Component (attached)', function() {
  beforeEach(function() {
    this.node = Node();
    this.component = Component();
    this.node.addComponent(this.component);
  });

  it('should have a ref to the node', function() {
    expect(this.component._node).toEqual(this.node);
  });

  it('should run updates', function(done) {
    this.component.update = done;
    this.component.requestUpdate();
    this.component.system.runUpdates();
  });

  it('should add a ref to itself on the node', function() {
    expect(this.node.components[0]).toEqual(this.component);
  });
});

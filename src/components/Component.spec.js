import Component from './Component';
import Node from '../core/Node';

describe('Component (unattached)', function() {
  it('should not run updates when not attached to a node', function() {
    return;
    var wasRun = false, comp = Component.instance();
    comp.update = function() { wasRun = true };
    comp.requestUpdate();
    // TODO: need a fake loop to test
  });
});

describe('Component (attached)', function() {
  beforeEach(function() {
    this.node = Node();
    this.component = Component.instance().attachTo(this.node);
  });

  it('should have a ref to the node', function() {
    expect(this.component._node).toEqual(this.node);
  });

  it('should add a ref to itself on the node', function() {
    expect(this.node.components[0]).toEqual(this.component);
  });

  it('should run updates', function() {
    var update = jasmine.createSpy('update');

    this.component.update = update;
    this.component.requestUpdate();
    Component.loop.step();

    expect(update.calls.count()).toEqual(1);
  });

});

import Component from './Component';
import Node from '../core/Node';
import FrameLoop from '../core/FrameLoop';

describe('Component (unattached)', function() {
  beforeEach(function() {
    Component.loop = new FrameLoop();
  });

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
    Component.loop = new FrameLoop();
    this.node = Node.instance();
    this.node.addComponents(Component);
  });

  it('should have a ref to the node', function() {
    expect(this.node.component._node).toEqual(this.node);
  });

  /*
  it('should add a ref to itself on the node', function() {
    expect(this.node.component).toEqual(this.component);
  });
  */

  it('should run updates', function() {
    var update = jasmine.createSpy('update');

    this.node.component.update = update;
    this.node.component.requestUpdate();
    Component.loop.step();

    expect(update.calls.count()).toEqual(1);
  });

});

import FrameLoop from './FrameLoop';

describe('FrameLoop', function() {

  it('queues and runs functions in a step', function() {
    var loop = new FrameLoop();
    var update = jasmine.createSpy('update');

    var context = {};
    var data = {};

    loop.onNextTick(update, context, data);
    loop.step();

    expect(update.calls.count()).toEqual(1);
    expect(update).toHaveBeenCalledWith(data, jasmine.any(Number));
    expect(update.calls.first().object).toBe(context);
  });

});
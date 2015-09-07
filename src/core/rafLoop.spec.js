import raf from '../util/raf-polyfill';
import rafLoop from '../core/rafLoop';

/*
describe('raf-mock', function() {
  raf.mock(true);

  it('should execute callbacks', function() {
    var callback = jest.genMockFunction();
    raf.requestAnimationFrame(callback);
    raf.step();
    expect(callback).toBeCalled();
  });
});

describe('rafLoop', function() {
  rafLoop.start();

  it('should run the callback on the next frame with correct args', function() {
    var callback = jest.genMockFunction();
    var context = { context: true };
    var data = { data: true };

    rafLoop.onNextTick(callback, context, data);
    raf.step();

    expect(callback).toBeCalled();
    // context (this)
    expect(callback.mock.instances[0]).toBe(context);
    // 1st arg (data)
    expect(callback.mock.calls[0][0]).toBe(data);
    // 2nd arg (timestamp)
    expect(callback.mock.calls[0][1]).toEqual(jasmine.any(Number));
  });

  it('should pause/resume the queue for long running updates', function() {
    var callback1 = jest.genMockFunction().mockImplementation(function() {
      rafLoop.blockFor(20);
    });
    var callback2 = jest.genMockFunction();
    rafLoop.onNextTick(callback1);
    rafLoop.onNextTick(callback2);
    raf.step();
    raf.step();
    expect(callback1).toBeCalled();
    expect(callback2).toBeCalled();

    // The main test; they should be called from different frames, and
    // consequentally, will be passed different timestamps
    expect(callback1.mock.calls[0][1]).not.toBe(callback2.mock.calls[0][1]);
  });
});

*/
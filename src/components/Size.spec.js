import Size from './Size';
import Vec3 from '../util/Vec3';
import FrameLoop from '../core/FrameLoop';
import Component from '../components/Component';

describe('SizeComponent', function() {
  beforeEach(function() {
    Component.loop = new FrameLoop();
    this.size = Size.instance();
  });

  it('accepts setSizeMode with x, y, z args', function() {
    this.size.setSizeMode(1,2,3);
    expect(this.size._sizeMode[0]).toBe(1);
    expect(this.size._sizeMode[1]).toBe(2);
    expect(this.size._sizeMode[2]).toBe(3);
  });

  it('accepts setSizeMode with a single Vec3 arg', function() {
    this.size.setSizeMode(Vec3(1,2,3));
    expect(this.size._sizeMode[0]).toBe(1);
    expect(this.size._sizeMode[1]).toBe(2);
    expect(this.size._sizeMode[2]).toBe(3);
  });

  it('accepts setAbsolute with x, y, z args', function() {
    this.size.setAbsolute(1,2,3);
    expect(this.size._absoluteSize[0]).toBe(1);
    expect(this.size._absoluteSize[1]).toBe(2);
    expect(this.size._absoluteSize[2]).toBe(3);
  });

  it('accepts setAbsolute with a single Vec3 arg', function() {
    this.size.setAbsolute(Vec3(1,2,3));
    expect(this.size._absoluteSize[0]).toBe(1);
    expect(this.size._absoluteSize[1]).toBe(2);
    expect(this.size._absoluteSize[2]).toBe(3);
  });

  it('should calculate absolute sizes on update', function() {
    this.size.setSizeMode(
      Size.ABSOLUTE_SIZE,
      Size.ABSOLUTE_SIZE,
      Size.ABSOLUTE_SIZE
    );
    this.size.setAbsolute(1, 2, 3);
    this.size.update();
    expect(this.size._size[0]).toBe(1);
    expect(this.size._size[1]).toBe(2);
    expect(this.size._size[2]).toBe(3);
  });
});
import SizeComponent from './SizeComponent';
import Vec3 from '../util/Vec3';

describe('SizeComponent', function() {
  beforeEach(function() {
    this.size = SizeComponent();
  });

  it('should calculate absolute sizes', function() {
    this.size.setSizeMode(
      SizeComponent.ABSOLUTE_SIZE,
      SizeComponent.ABSOLUTE_SIZE,
      SizeComponent.ABSOLUTE_SIZE
    );
    this.size.setAbsoluteSize(Vec3(20,25,30));
    expect(this.size._absoluteSize[0]).toBe(20);
    expect(this.size._absoluteSize[1]).toBe(25);
    expect(this.size._absoluteSize[2]).toBe(30);
  });
});
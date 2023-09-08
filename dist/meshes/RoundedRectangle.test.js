import { RoundedRectangle } from './RoundedRectangle.js';
describe('RoundedRectangle', () => {
    it('inherits property types from behaviors, for TypeScript', () => {
        ~class extends RoundedRectangle {
            test() {
                this.wireframe;
                this.cornerRadius;
            }
        };
    });
});
//# sourceMappingURL=RoundedRectangle.test.js.map
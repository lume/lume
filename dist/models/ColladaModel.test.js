import { ColladaModel } from './ColladaModel.js';
describe('ColladaModel', () => {
    it('inherits property types from behaviors, for TypeScript', () => {
        ~class extends ColladaModel {
            test() {
                this.src;
            }
        };
    });
});
//# sourceMappingURL=ColladaModel.test.js.map
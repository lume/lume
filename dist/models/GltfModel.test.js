import { GltfModel } from './GltfModel.js';
describe('GltfModel', () => {
    it('inherits property types from behaviors, for TypeScript', () => {
        ~class extends GltfModel {
            test() {
                this.dracoDecoder;
            }
        };
        // TODO enable TSX and test JSX markup.
    });
});
//# sourceMappingURL=GltfModel.test.js.map
import {FbxModel} from './FbxModel.js'

describe('FbxModel', () => {
	it('inherits property types from behaviors, for TypeScript', () => {
		~class extends FbxModel {
			test() {
				this.src
			}
		}

		// TODO enable TSX and test JSX markup.
	})
})

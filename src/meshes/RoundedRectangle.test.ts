import {RoundedRectangle} from './RoundedRectangle.js'

describe('RoundedRectangle', () => {
	it('inherits property types from behaviors, for TypeScript', () => {
		~class extends RoundedRectangle {
			test() {
				this.wireframe
				this.cornerRadius
			}
		}

		// TODO enable TSX and test JSX markup.
	})
})

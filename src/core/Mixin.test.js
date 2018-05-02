import Mixin, { HasInstance } from './Mixin'
import { isInstanceof } from './Utility'

describe('Mixin', () => {

    it('Mixin returns a Function', () => {
        const Foo = Mixin(Base => class Foo extends Base { })
        class Bar {}
        const Baz = Foo.mixin( Bar )
        const Lorem = Foo.mixin( Bar )

        expect( typeof Foo ).toBe( 'function' )
        expect( typeof Foo.mixin ).toBe( 'function' )
        expect( typeof Baz ).toBe( 'function' )
        expect( typeof Lorem ).toBe( 'function' )
    })

    it('Mixin applications are cached', () => {
        const Foo = Mixin(Base => class Foo extends Base { })
        class Bar {}
        const Baz = Foo.mixin( Bar )
        const Lorem = Foo.mixin( Bar )

        // caching of the same mixin application
        expect( Baz ).toBe( Lorem )
    })

    it('instanceof works with multiple classes generated from the same Mixin', () => {
        const Foo = Mixin(Base => class Foo extends Base { })
        class Bar {}
        const Baz = Foo.mixin( Bar )
        const Lorem = Foo.mixin( Bar )

        const baz = new Baz

        expect( baz instanceof Foo ).toBe( true )
        expect( isInstanceof( baz, Foo ) ).toBe( true )

        expect( baz instanceof Bar ).toBe( true )
        expect( isInstanceof( baz, Bar ) ).toBe( true )

        expect( baz instanceof Baz ).toBe( true )
        expect( isInstanceof( baz, Baz ) ).toBe( true )

        expect( baz instanceof Lorem ).toBe( true )
        expect( isInstanceof( baz, Lorem ) ).toBe( true )
    })

    it('HasInstance delegates to super Symbol.hasInstance method, so regular instanceof works', () => {
        const Foo = Mixin(Base => class Foo extends Base { })
        class Bar {}
        const Baz = Foo.mixin( Bar )
        const Lorem = Foo.mixin( Bar )

        expect( ({}) instanceof Baz ).toBe( false )

        class Thing extends Baz {}

        expect( (new Thing) instanceof Thing ).toBe( true )
    })

    it('When Symbol is supported, instanceof works', () => {

        const Ipsum = Mixin(Base => class Ipsum extends Base { })
        class Blah {}
        const One = Ipsum.mixin( Blah )

        const one = new One

        expect( one instanceof One ).toBe( true )

        // there's two versions of Ipsum in play, the original one, and the one
        // created when making `One`, but instanceof checks still work:
        expect( one instanceof Ipsum ).toBe( true )
    })

    it('When Symbol is not supported, instanceof does not work', () => {

        function test() {
            const Ipsum = Mixin(Base => class Ipsum extends Base { })
            class Blah {}
            const One = Ipsum.mixin( Blah )

            const one = new One

            expect( one instanceof One ).toBe( true )

            // Without Symbol.hasInstance, the internal trick doesn't work, so
            // instanceof won't be useful like we'd like it to be:
            expect( one instanceof Ipsum ).toBe( false )
        }

        const originalSymbol = Symbol

        Symbol = () => Math.random()

        test()

        Symbol = void 0

        test()

        Symbol = originalSymbol
    })

    it('if a class already has its own Symbol.hasInstance method, we do not override it', () => {
        function fn() {}

        const FooMixin = HasInstance(Base => {
            const Class = class Foo extends Base {}

            Object.defineProperty(Class, Symbol.hasInstance, { value: fn })

            return Class
        })

        const Foo = FooMixin(class{})

        expect( Foo[Symbol.hasInstance] ).toBe( fn )

        const BarMixin = HasInstance(Base => class Bar extends Base {})

        const Bar = BarMixin(class{})

        expect( Bar[Symbol.hasInstance] ).not.toBe( fn )
    })

    it('configuring a default base class', () => {

        const Foo = Mixin(Base => class Foo extends Base { }, Map)
        const Bar = class Bar extends Foo {}
        const bar = new Bar
        const Baz = class Baz extends Foo.mixin(WeakMap) {}
        const baz = new Baz

        expect( bar instanceof Map ).toBe( true )

        expect( baz instanceof Map ).toBe( false )
        expect( baz instanceof WeakMap ).toBe( true )
    })

    it('check there are no duplicate applications of a mixin in a class hierarchy', () => {

        const Foo = Mixin(Base => class Foo extends Base { }, Map)
        class Bar extends Foo {}

        // because Bar already has Foo
        expect( Foo.mixin( Bar ) ).toBe( Bar )
    })
})

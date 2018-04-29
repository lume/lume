import Mixin, { HasInstance } from './Mixin'
import { isInstanceof } from './Utility'

test('TODO: Mixin test', () => {
    const Foo = Mixin(Base => class Foo extends Base { })

    expect( typeof Foo ).toBe( 'function' )
    expect( typeof Foo.mixin ).toBe( 'function' )

    class Bar {}
    const Baz = Foo.mixin( Bar )
    const Lorem = Foo.mixin( Bar )

    expect( typeof Baz ).toBe( 'function' )
    expect( typeof Lorem ).toBe( 'function' )

    // caching of the same mixin application
    expect( Baz ).toBe( Lorem )

    const baz = new Baz

    expect( baz ).toBeInstanceOf( Foo )
    expect( isInstanceof( baz, Foo ) ).toBe( true )

    expect( baz ).toBeInstanceOf( Bar )
    expect( isInstanceof( baz, Bar ) ).toBe( true )

    expect( baz ).toBeInstanceOf( Baz )
    expect( isInstanceof( baz, Baz ) ).toBe( true )

    expect( baz ).toBeInstanceOf( Lorem )
    expect( isInstanceof( baz, Lorem ) ).toBe( true )

    expect( {} ).not.toBeInstanceOf( Baz )

    class Thing extends Baz {}

    expect( new Thing ).toBeInstanceOf( Thing )

    { // When Symbol is supported
        const Ipsum = Mixin(Base => class Ipsum extends Base { })
        class Blah {}
        const One = Ipsum.mixin( Blah )

        const one = new One

        expect( one ).toBeInstanceOf( One )

        // there's two versions of Ipsum in play, the original one, and the one
        // created when making `One`, but instanceof checks still work:
        expect( one ).toBeInstanceOf( Ipsum )
    }

    { // when Symbol is not supported
        function test() {
            const Ipsum = Mixin(Base => class Ipsum extends Base { })
            class Blah {}
            const One = Ipsum.mixin( Blah )

            const one = new One

            expect( one ).toBeInstanceOf( One )

            // Without Symbol.hasInstance, the internal trick doesn't work, so
            // instanceof won't be useful like we'd like it to be:
            expect( one ).not.toBeInstanceOf( Ipsum )
        }

        const originalSymbol = Symbol

        Symbol = () => Math.random()

        test()

        Symbol = void 0

        test()

        Symbol = originalSymbol
    }

    { // if a class already has it's own Symbol.hasInstance method, we don't override it
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
    }

    { // configuring a default base class
        const Foo = Mixin(Base => class Foo extends Base { }, Map)
        const Bar = class Bar extends Foo {}
        const bar = new Bar
        const Baz = class Baz extends Foo.mixin(WeakMap) {}
        const baz = new Baz

        expect( bar ).toBeInstanceOf( Map )

        expect( baz ).not.toBeInstanceOf( Map )
        expect( baz ).toBeInstanceOf( WeakMap )
    }

    { // check there's no duplicate applications of a mixin in a class hierarchy
        const Foo = Mixin(Base => class Foo extends Base { }, Map)
        class Bar extends Foo {}

        // because Bar already has Foo
        expect( Foo.mixin( Bar ) ).toBe( Bar )
    }
})

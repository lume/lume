import Class from 'lowclass'

const Animal = Class('Animal', {
    sound: '',
    constructor(sound: string) {
        this.sound = sound
    },
    makeSound() {
        console.log(this.sound)
    },
})

const a = new Animal('')

a.makeSound()

const Dog = Class('Dog').extends(Animal, ({Super}) => ({
    constructor(size: 'small' | 'big') {
        if (size === 'small') Super(this).constructor('woof')
        if (size === 'big') Super(this).constructor('WOOF')
    },

    // makeSound(d: number) {
    //     console.log(this.sound, d)
    // },
    makeSound() {
        Super(this).makeSound()
        console.log(this.sound)
    },

    bark() {
        this.makeSound()
    },
    other() {
        this.bark()
    },
}))
type Dog = InstanceType<typeof Dog>

const smallDog: Dog = new Dog('small')
smallDog.bark() // "woof"

const bigDog = new Dog('big')
bigDog.bark() // "WOOF"

bigDog.bark()
bigDog.makeSound()

const Foo = Class('Foo', ({Public, Protected, Private}) => ({
    constructor(s: string) {
        console.log(s)
    },

    static: {
        staticProp: 123,

        staticMethod() {
            console.log(Foo.staticProp) // 123
        },
    },

    publicProp: 'blah',

    publicMethod(a: string) {
        // TODO, this should work like Foo.staticMethod()
        this.constructor.staticMethod()

        console.log(a)
    },

    protected: {
        protectedProp: 456,

        protectedMethod(a: string) {
            console.log(a)
            console.log(Protected(this).protectedProp)
        },
    },

    private: {
        privateProp: 789,

        privateMethod() {
            this.publicProp
            this.publicMethod('') // Should this be allowed? Or do we just the below line to work ?
            Public(this).publicMethod('')
        },
    },

    test() {
        this.publicMethod('')

        console.log(this.publicProp) // 'blah'

        let p = Protected(this)
        console.log(p)
        Protected(this).protectedMethod('')
        console.log(Protected(this).protectedProp) // 456

        Private(this).privateMethod()
        console.log(Private(this).privateProp) // 789
        return Private(this).privateProp
    },
}))

let foo = new Foo('')

console.log(foo.publicProp)
// console.log(foo.protectedProp)
// console.log(foo.privateProp)

Foo.staticMethod()
Foo.staticProp

const Bar = Class('Bar').extends(Foo, ({Public, Protected, Private, Super}) => ({
    constructor(sound: string) {
        sound
    },
    static: {
        derivedStatic: 10,
    },
    private: {
        derivedPrivate: 10,
    },
    protected: {
        derivedProtected: 10,
    },
    derivedPublicMethod() {
        Protected(this).protectedMethod('')
        Protected(this).protectedProp
        Protected(this).derivedProtected
        Private(this).derivedPrivate
        this.test()
        Public(this).test()
    },
    test() {
        const b = {}

        // TODO This call should only allow `Super(this)` or `Super(Protected(this))`.
        Super(b).test()

        return Super(this).test()
    },
}))

var bar = new Bar('')
bar.derivedPublicMethod()
bar.test()
bar.derivedPrivate // should be error
Bar.derivedStatic

Bar.staticMethod()

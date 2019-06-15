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
        if (size === 'small') super('woof')
        if (size === 'big') super('WOOF')
    },

    // makeSound(d: number) {
    //     console.log(this.sound, d)
    // },
    makeSound() {
        super.makeSound()
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
        // TODO TS, this should work like Foo.staticMethod()
        // this.constructor.staticMethod()

        console.log(a)
    },

    protected: {
        protectedProp: 456,

        protectedMethod(a: string) {
            console.log(a)
            console.log(this.protectedProp)
        },
    },

    private: {
        privateProp: 789,

        privateMethod() {
            this.publicProp
            this.publicMethod('') // Should this be allowed? Or do we just the below line to work ?
            this.publicMethod('')
        },
    },

    test() {
        this.publicMethod('')

        console.log(this.publicProp) // 'blah'

        let p = Protected(this)
        console.log(p)
        this.protectedMethod('')
        console.log(this.protectedProp) // 456

        this.privateMethod()
        console.log(this.privateProp) // 789
        return this.privateProp
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
        this.protectedMethod('')
        this.protectedProp
        this.derivedProtected
        this.derivedPrivate
        this.test()
        this.test()
    },
    test() {
        const b = {}

        // TODO TS This call should only allow `Super(this)` or `Super(Protected(this))`.
        Super(b).test()

        return super.test()
    },
}))

var bar = new Bar('')
bar.derivedPublicMethod()
bar.test()
// bar.derivedPrivate // should be error
Bar.derivedStatic

Bar.staticMethod()

import XYZValues from './XYZValues'

function checkValues(v: XYZValues, x: any, y: any, z: any) {
    expect(v.x).toBe(x)
    expect(v.y).toBe(y)
    expect(v.z).toBe(z)
}

describe('XYZValues', () => {
    describe('.constructor', () => {
        it('is a function', () => {
            expect(typeof XYZValues).toBe('function')
        })

        it('has default args', () => {
            const a = new XYZValues()
            checkValues(a, undefined, undefined, undefined)
        })

        it('can take arbitrary values', () => {
            const a = new XYZValues(1, 'foo', false)
            checkValues(a, 1, 'foo', false)
        })

        it('can take an array of values', () => {
            const values = [1, 'foo', false]
            const a = new XYZValues(values)
            checkValues(a, 1, 'foo', false)
        })

        it('can take an object with x, y, z properties.', () => {
            const values = {x: 1, y: 'foo', z: false}
            const a = new XYZValues(values)
            checkValues(a, 1, 'foo', false)
        })
    })

    describe('.set', () => {
        it('can take arbitrary values', () => {
            const a = new XYZValues()
            a.set(1, 'foo', false)
            checkValues(a, 1, 'foo', false)
        })
    })

    describe('.fromArray', () => {
        it('can take an array of values', () => {
            const a = new XYZValues()
            const array: [any, any, any] = [1, 'foo', false]
            a.fromArray(array)
            checkValues(a, 1, 'foo', false)
        })
    })

    describe('.toArray', () => {
        it('returns an array representation', () => {
            const a = new XYZValues()
            const array: [any, any, any] = [1, 'foo', false]
            a.fromArray(array)
            expect(a.toArray()).toEqual(array)
        })
    })

    describe('.fromObject', () => {
        it('can take an object with x, y, z properties.', () => {
            const a = new XYZValues()
            const obj = {x: 1, y: 'foo', z: false}
            a.fromObject(obj)
            checkValues(a, 1, 'foo', false)
        })
    })

    describe('.toObject', () => {
        it('returns an object with x, y, z properties.', () => {
            const a = new XYZValues()
            const obj = {x: 1, y: 'foo', z: false}
            a.fromObject(obj)
            expect(a.toObject()).toEqual(obj)
        })
    })

    describe('.fromString', () => {
        it('can take an string of delimited values, default space separated', () => {
            const a = new XYZValues()

            let string = '1 foo false'
            a.fromString(string)
            checkValues(a, '1', 'foo', 'false')

            string = '  1 foo   false'
            a.fromString(string)
            checkValues(a, '1', 'foo', 'false')

            testWithSeparator(a, ',')
            testWithSeparator(a, ';')
            testWithSeparator(a, '' + Math.random())
        })
    })

    describe('.toString', () => {
        it('returns a string of the values, separated by space or custom delimiter (with spacing)', () => {
            const a = new XYZValues()
            let string = '1 foo false'
            a.fromString(string)
            expect(a.toString()).toEqual(string)

            string = '1, foo, false'
            a.fromString(string)
            expect(a.toString()).not.toEqual(string)
            expect(a.toString(',')).toEqual(string)

            string = '1, foo, false'
            a.fromString(string)
            expect(a.toString()).not.toEqual(string)
            const sep = '' + Math.random()
            expect(a.toString(sep)).toEqual(`1${sep} foo${sep} false`)
        })
    })

    // TODO, this doesn't work because .set currently doesn't accept undefined values.
    xdescribe('.fromDefault', () => {
        it('set the values to default', () => {
            const a = new XYZValues(1, 2, 3)
            a.fromDefault()
            checkValues(a, undefined, undefined, undefined)
        })
    })

    describe('setters', () => {
        it('set values', () => {
            const a = new XYZValues()

            a.x = 1
            a.y = 2
            a.z = 3

            checkValues(a, 1, 2, 3)
            expect(a.toArray()).toEqual([1, 2, 3])
        })

        it('trigger valuechange events', () => {
            const a = new XYZValues()
            const changedProps: string[] = []

            a.on('valuechanged', (prop: string) => {
                changedProps.push(prop)
            })

            a.x = 1
            a.y = 2
            a.z = 3

            expect(changedProps).toEqual(['x', 'y', 'z'])
        })
    })
})

function testWithSeparator(a: XYZValues, separator: string) {
    let string = `1${separator} foo${separator} false`
    a.fromString(string, separator)
    checkValues(a, '1', 'foo', 'false')

    string = `1${separator}      foo${separator}false    `
    a.fromString(string, separator)
    checkValues(a, '1', 'foo', 'false')

    string = `  1  foo${separator}     false  `
    a.fromString(string, separator)
    checkValues(a, '1', 'foo', 'false')
}

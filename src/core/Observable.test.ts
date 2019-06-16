import Observable from './Observable'

let eventCount = 0
let eventCount2 = 0

describe('Observable', () => {
    describe('provides an event pattern', () => {
        it('triggers an event handler based on event names', () => {
            const o = new Observable()

            const eventHandler = () => {
                eventCount += 1
            }

            const eventHandler2 = () => {
                eventCount2 += 1
            }

            o.on('foo', eventHandler)
            o.on('bar', eventHandler2)

            o.emit('foo')

            expect(eventCount).toBe(1)
            expect(eventCount2).toBe(0)

            o.trigger('foo')

            expect(eventCount).toBe(2)
            expect(eventCount2).toBe(0)

            o.triggerEvent('foo')

            expect(eventCount).toBe(3)
            expect(eventCount2).toBe(0)

            o.triggerEvent('foo')
            o.trigger('foo')
            o.emit('foo')

            expect(eventCount).toBe(6)
            expect(eventCount2).toBe(0)

            o.emit('bar')

            expect(eventCount).toBe(6)
            expect(eventCount2).toBe(1)

            o.trigger('bar')

            expect(eventCount).toBe(6)
            expect(eventCount2).toBe(2)

            o.triggerEvent('bar')

            expect(eventCount).toBe(6)
            expect(eventCount2).toBe(3)

            o.off('foo', eventHandler)

            o.triggerEvent('foo')
            o.trigger('foo')
            o.emit('foo')

            expect(eventCount).toBe(6)
            expect(eventCount2).toBe(3)

            o.triggerEvent('bar')
            o.trigger('bar')
            o.emit('bar')

            expect(eventCount).toBe(6)
            expect(eventCount2).toBe(6)

            o.off('bar', eventHandler)

            o.triggerEvent('bar')
            o.trigger('bar')
            o.emit('bar')

            expect(eventCount).toBe(6)
            expect(eventCount2).toBe(9)

            o.off('bar', eventHandler2)

            o.triggerEvent('bar')
            o.trigger('bar')
            o.emit('bar')

            expect(eventCount).toBe(6)
            expect(eventCount2).toBe(9)
        })

        it('passes event payloads to event handlers', () => {
            const o = new Observable()

            let thePayload
            let thePayload2

            const handler = payload => {
                thePayload = payload
            }

            const handler2 = payload => {
                thePayload2 = payload
            }

            o.on('foo', handler)
            o.on('bar', handler2)

            o.emit('foo', 56)

            expect(thePayload).toBe(56)
            expect(thePayload2).toBe(undefined)

            o.emit('bar', 42)

            expect(thePayload).toBe(56)
            expect(thePayload2).toBe(42)

            o.off('bar', handler2)

            o.emit('foo', 'oh yeah')
            o.emit('bar', 123)

            expect(thePayload).toBe('oh yeah')
            expect(thePayload2).toBe(42)
        })
    })
})

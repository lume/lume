import _ from 'lodash'

let o = {foo: 'foo'}

console.log('self?', self)
throw('o has foo: '+_.has(o, 'foo'))

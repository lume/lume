export function dashCase(str){
  return typeof str === 'string'
    ? str.split(/([_A-Z])/).reduce((one, two, idx) => {
        const dash = !one || idx % 2 === 0 ? '' : '-'
        two = two === '_' ? '' : two
        return `${one}${dash}${two.toLowerCase()}`
      })
    : str
}

export const empty = (val) => val == null

export function keys(obj) {
  obj = obj || {}
  const names = Object.getOwnPropertyNames(obj)
  return Object.getOwnPropertySymbols
    ? names.concat(Object.getOwnPropertySymbols(obj))
    : names
}

// return a new array with unique items (duplicates removed)
export function unique(array) {
    return Array.from(new Set(array))
}

// return a new object with `properties` picked from `source`
export function pick(source, properties) {
    let result = {}
    return properties.forEach(prop => {
        result[prop] = source[prop]
    })
}

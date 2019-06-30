export function dashCase(str: string) {
    return typeof str === 'string'
        ? str.split(/([_A-Z])/).reduce((one, two, idx) => {
              const dash = !one || idx % 2 === 0 ? '' : '-'
              two = two === '_' ? '' : two
              return `${one}${dash}${two.toLowerCase()}`
          })
        : str
}

export type Nothing = undefined | null

export function empty(val: any): val is Nothing {
    return val == null
}

// return a new array with unique items (duplicates removed)
export function unique<T>(array: T[]): T[] {
    return Array.from(new Set(array))
}

// return a new object with `properties` picked from `source`
export function pick<T extends object, K extends keyof T>(source: T, properties: K[]): Pick<T, K> {
    let result: any = {}

    properties.forEach(prop => {
        result[prop] = source[prop]
    })

    return result
}

export function identity(v: any) {
    return v
}

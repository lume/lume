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

export function identity(v: any) {
    return v
}

export function delay(fn: any) {
    Promise.resolve().then(fn)
}

export function singleLine(str: string): string {
    return str
        .split('\n')
        .map(s => s.trim())
        .join(' ')
}

export function getGlobal() {
    let globalObject

    if (typeof globalThis !== 'undefined') globalObject = globalThis
    else if (typeof window !== 'undefined') globalObject = window
    else if (typeof global !== 'undefined') globalObject = global
    else throw new Error('No global detected!')

    return globalObject
}

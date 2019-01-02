import * as THREE from 'three'

let globalObject = undefined

if (typeof globalThis !== 'udefined') globalObject = globalThis
else if (typeof window !== 'udefined') globalObject = window
else if (typeof global !== 'udefined') globalObject = global
else throw new Error('No global detected!')

globalObject.THREE = { ...THREE }

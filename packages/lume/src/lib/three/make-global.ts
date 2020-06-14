// import THREE = require('three')
import * as THREE from 'three'
import {getGlobal} from '../../utils/getGlobal'

const global = getGlobal() as any

if (!global.THREE) global.THREE = {...THREE}

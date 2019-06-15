// import THREE = require('three')
import * as THREE from 'three'
import {getGlobal} from '../../utils/getGlobal'
;(getGlobal() as any).THREE = {...THREE}

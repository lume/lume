export class NURBSCurve extends Curve<any> {
    constructor(degree: any, knots: any, controlPoints: any, startKnot: any, endKnot: any);
    degree: any;
    knots: any;
    controlPoints: Vector4[];
    startKnot: any;
    endKnot: any;
    getPoint(t: any, optionalTarget?: Vector3): Vector3;
    getTangent(t: any, optionalTarget?: Vector3): Vector3;
}
import { Curve } from "three/src/extras/core/Curve.js";
import { Vector4 } from "three/src/math/Vector4.js";
import { Vector3 } from "three/src/math/Vector3.js";
//# sourceMappingURL=NURBSCurve.d.ts.map
// Register behaviors that can be used on mesh elements (elements that have geometry).
// TODO: maybe useDefaultNames() should register these, otherwise the user can
// choose names for better flexibility. See TODO NAMING in Mesh.ts.
import '../html/behaviors/BasicMaterialBehavior.js'
import '../html/behaviors/PhongMaterialBehavior.js'
import '../html/behaviors/ShaderMaterialBehavior.js'
import '../html/behaviors/DOMNodeMaterialBehavior.js'
import '../html/behaviors/BoxGeometryBehavior.js'
import '../html/behaviors/SphereGeometryBehavior.js'
import '../html/behaviors/PlaneGeometryBehavior.js'
import '../html/behaviors/DOMNodeGeometryBehavior.js'
import '../html/behaviors/RoundedRectangleGeometryBehavior.js'
import '../html/behaviors/PLYGeometryBehavior.js'

var Node = Infamous.engine.Node;

/**
 * Sprite Class
 * @class Sprite
 * @return {Sprite} A new instance of Sprite
 */
class Sprite extends Node {

  render (scene) {

      // http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

      // scene.matrix.copy(camera.matrixWorldInverse);
      // scene.matrix.transpose();
      // scene.matrix.copyPosition(object.matrixWorld);
      // scene.matrix.scale(object.scale);

      // scene.matrix.elements[3] = 0;
      // scene.matrix.elements[7] = 0;
      // scene.matrix.elements[11] = 0;
      // scene.matrix.elements[15] = 1;

      // style = getObjectCSSMatrix(scene.matrix);
  }

}

Infamous.engine.Sprite = Sprite;
// based on THREE.CSS3DRenderer from https://github.com/mrdoob/three.js/blob/51ac0084709d4d3795ccb7119ee24e6a808618df/examples/js/renderers/CSS3DRenderer.js

import * as THREE from 'three'

export function CSS3DObjectNested( element ) {

	THREE.Object3D.call( this );

	this.element = element;

	requestAnimationFrame( () => {

    	// delay to the next frame because attributes are not allowed be set
    	// inside Custom Element (i.e. Web Component) constructors, otherwise
    	// this can throw an error if called inside a Custom Element
    	// constructor.

    	this.element.style.position = 'absolute';

	} );

};

CSS3DObjectNested.prototype = Object.create( THREE.Object3D.prototype );
CSS3DObjectNested.prototype.constructor = CSS3DObjectNested;

CSS3DObjectNested.prototype.dispose = function() {

    this.element = null

};

// TODO Sprite is untested in this new nested renderer
export function CSS3DNestedSprite( element ) {

	CSS3DObjectNested.call( this, element );

};

CSS3DNestedSprite.prototype = Object.create( CSS3DObjectNested.prototype );
CSS3DNestedSprite.prototype.constructor = CSS3DNestedSprite;

//

export function CSS3DRendererNested() {

	console.log( 'THREE.CSS3DRendererNested', THREE.REVISION );

	var _width, _height;
	var _widthHalf, _heightHalf;

	var matrix = new THREE.Matrix4();

	var cache = {
		camera: { fov: 0, style: '' },
		objects: new WeakMap()
	};

	var domElement = document.createElement( 'div' );
	domElement.classList.add( 'CSS3DRendererNested' );
	domElement.style.overflow = 'hidden';

	this.domElement = domElement;

	var cameraElement = document.createElement( 'div' );
	cameraElement.classList.add( 'cameraElement' );
	cameraElement.appendChild( document.createElement( 'slot' ) );

	cameraElement.style.WebkitTransformStyle = 'preserve-3d';
	cameraElement.style.transformStyle = 'preserve-3d';

	domElement.appendChild( cameraElement );

	this.getSize = function () {

		return {
			width: _width,
			height: _height
		};

	};

	this.setSize = function ( width, height ) {

		_width = width;
		_height = height;
		_widthHalf = _width / 2;
		_heightHalf = _height / 2;

		domElement.style.width = width + 'px';
		domElement.style.height = height + 'px';

		cameraElement.style.width = width + 'px';
		cameraElement.style.height = height + 'px';

	};

	function epsilon( value ) {

		return Math.abs( value ) < 1e-10 ? 0 : value;

	}

	function getCameraCSSMatrix( matrix ) {

		var elements = matrix.elements;

		return 'matrix3d(' +
			epsilon( elements[ 0 ] ) + ',' +
			epsilon( - elements[ 1 ] ) + ',' +
			epsilon( elements[ 2 ] ) + ',' +
			epsilon( elements[ 3 ] ) + ',' +
			epsilon( elements[ 4 ] ) + ',' +
			epsilon( - elements[ 5 ] ) + ',' +
			epsilon( elements[ 6 ] ) + ',' +
			epsilon( elements[ 7 ] ) + ',' +
			epsilon( elements[ 8 ] ) + ',' +
			epsilon( - elements[ 9 ] ) + ',' +
			epsilon( elements[ 10 ] ) + ',' +
			epsilon( elements[ 11 ] ) + ',' +
			epsilon( elements[ 12 ] ) + ',' +
			epsilon( - elements[ 13 ] ) + ',' +
			epsilon( elements[ 14 ] ) + ',' +
			epsilon( elements[ 15 ] ) +
		')';

	}

	function getObjectCSSMatrix( object, matrix ) {

		const parent = object.parent;
		const childOfScene = parent.type === 'Scene';

		var elements = matrix.elements;
		var matrix3d = 'matrix3d(' +
			epsilon( elements[ 0 ] ) + ',' +
			epsilon( elements[ 1 ] ) + ',' +
			epsilon( elements[ 2 ] ) + ',' +
			epsilon( elements[ 3 ] ) + ',' +
            epsilon( ( childOfScene ? - 1 : 1 ) * elements[ 4 ] ) + ',' +
			epsilon( ( childOfScene ? - 1 : 1 ) * elements[ 5 ] ) + ',' +
			epsilon( ( childOfScene ? - 1 : 1 ) * elements[ 6 ] ) + ',' +
			epsilon( ( childOfScene ? - 1 : 1 ) * elements[ 7 ] ) + ',' +
			epsilon( elements[ 8 ] ) + ',' +
			epsilon( elements[ 9 ] ) + ',' +
			epsilon( elements[ 10 ] ) + ',' +
			epsilon( elements[ 11 ] ) + ',' +
			epsilon( elements[ 12 ] ) + ',' + /* X position */
			epsilon( ( childOfScene ? 1 : - 1 ) * elements[ 13 ] ) + ',' + /* Y position */
			epsilon( elements[ 14 ] ) + ',' + /* Z position */
			epsilon( elements[ 15 ] ) +
		')';

		// similar to mountPoint
		return `${childOfScene ? 'translate(-50%, -50%)' : ''} ${matrix3d}`;

	}

	function renderObject( object, camera ) {

		if ( object instanceof CSS3DObjectNested ) {

			var style;

			if ( object instanceof CSS3DNestedSprite ) {

				// http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

				matrix.copy( camera.matrixWorldInverse );
				matrix.transpose();
				matrix.copyPosition( object.matrixWorld );
				matrix.scale( object.scale );

				matrix.elements[ 3 ] = 0;
				matrix.elements[ 7 ] = 0;
				matrix.elements[ 11 ] = 0;
				matrix.elements[ 15 ] = 1;

				style = getObjectCSSMatrix( object, matrix );

			} else {

				style = getObjectCSSMatrix( object, object.matrix );

			}

			var element = object.element;
			var cachedStyle = cache.objects.get( object );

			// if ( cachedStyle === undefined || cachedStyle !== style ) { // BUG, https://github.com/mrdoob/three.js/pull/15470
			if ( cachedStyle === undefined || cachedStyle.style !== style ) {

				element.style.WebkitTransform = style;
				element.style.transform = style;

				var objectData = { style: style };

				cache.objects.set( object, objectData );

			}

		}

		for ( var i = 0, l = object.children.length; i < l; i ++ ) {

			renderObject( object.children[ i ], camera );

		}

	}

	this.render = function ( scene, camera ) {

		var fov = camera.projectionMatrix.elements[ 5 ] * _heightHalf;

		if ( cache.camera.fov !== fov ) {

			if ( camera.isPerspectiveCamera ) {

				domElement.style.WebkitPerspective = fov + 'px';
				domElement.style.perspective = fov + 'px';

			}

			cache.camera.fov = fov;

		}

		scene.updateMatrixWorld();

		if ( camera.parent === null ) camera.updateMatrixWorld();

		if ( camera.isOrthographicCamera ) {

			var tx = - ( camera.right + camera.left ) / 2;
			var ty = ( camera.top + camera.bottom ) / 2;

		}

		var cameraCSSMatrix = camera.isOrthographicCamera ?
			'scale(' + fov + ')' + 'translate(' + epsilon( tx ) + 'px,' + epsilon( ty ) + 'px)' + getCameraCSSMatrix( camera.matrixWorldInverse ) :
			'translateZ(' + fov + 'px)' + getCameraCSSMatrix( camera.matrixWorldInverse );

		var style = cameraCSSMatrix +
			'translate(' + _widthHalf + 'px,' + _heightHalf + 'px)';

		if ( cache.camera.style !== style ) {

			cameraElement.style.WebkitTransform = style;
			cameraElement.style.transform = style;

			cache.camera.style = style;

		}

		renderObject( scene, camera );

	};

};

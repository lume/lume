/**
 * A really simple and basic 4x4 matrix implementation, compatible with CSS. Transform them, and
 * apply the toString() output to a node's transform style. Don't forget perspective :)
 *
 * By Peter Nederlof, https://github.com/peterned
 * Licensed under MIT, see license.txt or http://www.opensource.org/licenses/mit-license.php
 */

	   // _  __  __  __   ___  _____  _   _  __  _ \\
	  // | \/ |||  \/  ||/   \|_   _|| |_| ||| \/ | \\
	 //   \  // | |\/| ||  _  | | | ||  _  | \\  /   \\
	//     \//  |_|| |_||_| |_| |_| ||_| |_|  \\/     \\

	"use strict";

	var IDENTITY = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];

	function multiply (
		a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p,
		A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P
	) {
		return [
			a * A + b * E + c * I + d * M,
			a * B + b * F + c * J + d * N,
			a * C + b * G + c * K + d * O,
			a * D + b * H + c * L + d * P,
			e * A + f * E + g * I + h * M,
			e * B + f * F + g * J + h * N,
			e * C + f * G + g * K + h * O,
			e * D + f * H + g * L + h * P,
			i * A + j * E + k * I + l * M,
			i * B + j * F + k * J + l * N,
			i * C + j * G + k * K + l * O,
			i * D + j * H + k * L + l * P,
			m * A + n * E + o * I + p * M,
			m * B + n * F + o * J + p * N,
			m * C + n * G + o * K + p * O,
			m * D + n * H + o * L + p * P
		];
	}

	var sin = Math.sin;
	var cos = Math.cos;

	/**
	 * Matrix
	 *
	 */

	var Matrix = function (entities) {
		this.entities = entities || IDENTITY;
	};

	Matrix.prototype = {
		multiply: function (entities) {
			return new Matrix(
				multiply.apply(window, this.entities.concat(entities))
			);
		},

		transform: function (matrix) {
			return this.multiply(matrix.entities);
		},

		scale: function (s) {
			return this.multiply([
				s, 0, 0, 0,
				0, s, 0, 0,
				0, 0, s, 0,
				0, 0, 0, 1
			]);
		},

		rotateX: function (a) {
			var c = cos(a);
			var s = sin(a);
			return this.multiply([
				1, 0,  0, 0,
				0, c, -s, 0,
				0, s,  c, 0,
				0, 0,  0, 1
			]);
		},

		rotateY: function (a) {
			var c = cos(a);
			var s = sin(a);
			return this.multiply([
				 c, 0, s, 0,
				 0, 1, 0, 0,
				-s, 0, c, 0,
				 0, 0, 0, 1
			]);
		},

		rotateZ: function (a) {
			var c = cos(a);
			var s = sin(a);
			return this.multiply([
				c, -s, 0, 0,
				s,  c, 0, 0,
				0,  0, 1, 0,
				0,  0, 0, 1
			]);
		},

		translate: function (x, y, z) {
			return this.multiply([
				1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				x, y, z, 1
			]);
		},

		toString: function () {
			return 'matrix3d(' + this.entities.join(',') + ')';
		}
	};

module.exports = Matrix;

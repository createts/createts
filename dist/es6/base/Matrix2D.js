function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { Point } from './Point';
var DEG_TO_RAD = Math.PI / 180;
/**
 * Represents an affine transformation matrix, and provides tools for constructing and concatenating matrices.
 *
 * This matrix can be visualized as:
 *
 * 	[ a  c  tx
 * 	  b  d  ty
 * 	  0  0  1  ]
 */

export var Matrix2D =
/*#__PURE__*/
function () {
  /**
   * Position (0, 0) in a 3x3 affine transformation matrix.
   */

  /**
   * Position (0, 1) in a 3x3 affine transformation matrix.
   */

  /**
   * Position (1, 0) in a 3x3 affine transformation matrix.
   */

  /**
   * Position (1, 1) in a 3x3 affine transformation matrix.
   */

  /**
   * Position (2, 0) in a 3x3 affine transformation matrix.
   */

  /**
   * Position (2, 1) in a 3x3 affine transformation matrix.
   */

  /**
   * Creates an instance of Matrix2D.
   * @param [a] Specifies the a property for the new matrix
   * @param [b] Specifies the b property for the new matrix
   * @param [c] Specifies the c property for the new matrix
   * @param [d] Specifies the d property for the new matrix
   * @param [tx] Specifies the tx property for the new matrix
   * @param [ty] Specifies the ty property for the new matrix
   */
  function Matrix2D() {
    var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var tx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var ty = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

    _classCallCheck(this, Matrix2D);

    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.tx = 0;
    this.ty = 0;
    this.setValues(a, b, c, d, tx, ty);
  }
  /**
   * Sets the specified values on this instance.
   * @param [a] Specifies the a property for the new matrix
   * @param [b] Specifies the b property for the new matrix
   * @param [c] Specifies the c property for the new matrix
   * @param [d] Specifies the d property for the new matrix
   * @param [tx] Specifies the tx property for the new matrix
   * @param [ty] Specifies the ty property for the new matrix
   * @returns The current instance. Useful for chaining method calls
   */


  _createClass(Matrix2D, [{
    key: "setValues",
    value: function setValues() {
      var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var tx = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var ty = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      this.a = a;
      this.b = b;
      this.c = c;
      this.d = d;
      this.tx = tx;
      this.ty = ty;
      return this;
    }
    /**
     * Appends the specified matrix properties to this matrix.
     * This is the equivalent of multiplying `(this matrix) * (specified matrix)`.
     * @param a Specifies the a property for the new matrix
     * @param b Specifies the b property for the new matrix
     * @param c Specifies the c property for the new matrix
     * @param d Specifies the d property for the new matrix
     * @param tx Specifies the tx property for the new matrix
     * @param ty Specifies the ty property for the new matrix
     * @returns The current instance. Useful for chaining method calls
     */

  }, {
    key: "append",
    value: function append(a, b, c, d, tx, ty) {
      var a1 = this.a;
      var b1 = this.b;
      var c1 = this.c;
      var d1 = this.d;

      if (a !== 1 || b !== 0 || c !== 0 || d !== 1) {
        this.a = a1 * a + c1 * b;
        this.b = b1 * a + d1 * b;
        this.c = a1 * c + c1 * d;
        this.d = b1 * c + d1 * d;
      }

      this.tx = a1 * tx + c1 * ty + this.tx;
      this.ty = b1 * tx + d1 * ty + this.ty;
      return this;
    }
    /**
     * Prepends the specified matrix properties to this matrix.
     * This is the equivalent of multiplying `(specified matrix) * (this matrix)`.
     * @param a Specifies the a property for the new matrix
     * @param b Specifies the b property for the new matrix
     * @param c Specifies the c property for the new matrix
     * @param d Specifies the d property for the new matrix
     * @param tx Specifies the tx property for the new matrix
     * @param ty Specifies the ty property for the new matrix
     * @returns The current instance. Useful for chaining method calls
     */

  }, {
    key: "prepend",
    value: function prepend(a, b, c, d, tx, ty) {
      var a1 = this.a;
      var c1 = this.c;
      var tx1 = this.tx;
      this.a = a * a1 + c * this.b;
      this.b = b * a1 + d * this.b;
      this.c = a * c1 + c * this.d;
      this.d = b * c1 + d * this.d;
      this.tx = a * tx1 + c * this.ty + tx;
      this.ty = b * tx1 + d * this.ty + ty;
      return this;
    }
    /**
     * Appends the specified matrix to this matrix.
     * This is the equivalent of multiplying `(this matrix) * (specified matrix)`.
     * @param matrix
     * @returns The current instance. Useful for chaining method calls
     */

  }, {
    key: "appendMatrix",
    value: function appendMatrix(matrix) {
      return this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    }
    /**
     * Prepends the specified matrix to this matrix.
     * This is the equivalent of multiplying `(specified matrix) * (this matrix)`.
     * @param matrix
     * @returns The current instance. Useful for chaining method calls
     */

  }, {
    key: "prependMatrix",
    value: function prependMatrix(matrix) {
      return this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    }
    /**
     * Generates matrix properties from the specified display object transform properties, and appends them to this matrix.
     * @param x
     * @param y
     * @param scaleX
     * @param scaleY
     * @param rotation
     * @param skewX
     * @param skewY
     * @param transformX
     * @param transformY
     * @returns The current instance. Useful for chaining method calls
     */

  }, {
    key: "appendTransform",
    value: function appendTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, transformX, transformY) {
      var cos;
      var sin;

      if (rotation % 360) {
        var r = rotation * DEG_TO_RAD;
        cos = Math.cos(r);
        sin = Math.sin(r);
      } else {
        cos = 1;
        sin = 0;
      }

      if (skewX || skewY) {
        skewX *= DEG_TO_RAD;
        skewY *= DEG_TO_RAD;
        this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
        this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
      } else {
        this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
      }

      if (transformX || transformY) {
        // Appends the registration offset.
        this.tx -= transformX * this.a + transformY * this.c;
        this.ty -= transformX * this.b + transformY * this.d;
      }

      return this;
    }
    /**
     * Generates matrix properties from the specified display object transform properties, and prepends them to this matrix.
     * @param x
     * @param y
     * @param scaleX
     * @param scaleY
     * @param rotation
     * @param skewX
     * @param skewY
     * @param transformX
     * @param transformY
     * @returns The current instance. Useful for chaining method calls
     */

  }, {
    key: "prependTransform",
    value: function prependTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, transformX, transformY) {
      var cos;
      var sin;

      if (rotation % 360) {
        var r = rotation * DEG_TO_RAD;
        cos = Math.cos(r);
        sin = Math.sin(r);
      } else {
        cos = 1;
        sin = 0;
      }

      if (transformX || transformY) {
        this.tx -= transformX;
        this.ty -= transformY;
      }

      if (skewX || skewY) {
        skewX *= DEG_TO_RAD;
        skewY *= DEG_TO_RAD;
        this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
        this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
      } else {
        this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
      }

      return this;
    }
    /**
     * Applies a clockwise rotation transformation to the matrix.
     * @param angle The angle to rotate by, in degrees. To use a value in radians, multiply it by `180/Math.PI`
     * @returns The current instance. Useful for chaining method calls
     */

  }, {
    key: "rotate",
    value: function rotate(angle) {
      angle = angle * DEG_TO_RAD;
      var cos = Math.cos(angle);
      var sin = Math.sin(angle);
      var a1 = this.a;
      var b1 = this.b;
      this.a = a1 * cos + this.c * sin;
      this.b = b1 * cos + this.d * sin;
      this.c = -a1 * sin + this.c * cos;
      this.d = -b1 * sin + this.d * cos;
      return this;
    }
    /**
     * Applies a skew transformation to the matrix.
     * @param skewX The amount to skew horizontally in degrees. To use a value in radians, multiply it by `180/Math.PI`
     * @param skewY The amount to skew vertically in degrees
     * @returns The current instance. Useful for chaining method calls
     */

  }, {
    key: "skew",
    value: function skew(skewX, skewY) {
      skewX = skewX * DEG_TO_RAD;
      skewY = skewY * DEG_TO_RAD;
      this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
      return this;
    }
    /**
     * Applies a scale transformation to the matrix.
     * @param x The amount to scale horizontally. E.G. a value of 2 will double the size in the X direction, and 0.5 will halve it
     * @param y The amount to scale vertically
     * @returns The current instance. Useful for chaining method calls
     */

  }, {
    key: "scale",
    value: function scale(x, y) {
      this.a *= x;
      this.b *= x;
      this.c *= y;
      this.d *= y;
      return this;
    }
    /**
     * Translates the matrix on the x and y axes.
     * @param x
     * @param y
     * @returns The current instance. Useful for chaining method calls
     */

  }, {
    key: "translate",
    value: function translate(x, y) {
      this.tx += this.a * x + this.c * y;
      this.ty += this.b * x + this.d * y;
      return this;
    }
    /**
     * Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation)
     * @returns The current instance. Useful for chaining method calls
     */

  }, {
    key: "identity",
    value: function identity() {
      this.a = this.d = 1;
      this.b = this.c = this.tx = this.ty = 0;
      return this;
    }
    /**
     * Inverts the matrix, causing it to perform the opposite transformation.
     * @returns The current instance. Useful for chaining method calls
     */

  }, {
    key: "invert",
    value: function invert() {
      var a1 = this.a;
      var b1 = this.b;
      var c1 = this.c;
      var d1 = this.d;
      var tx1 = this.tx;
      var n = a1 * d1 - b1 * c1;
      this.a = d1 / n;
      this.b = -b1 / n;
      this.c = -c1 / n;
      this.d = a1 / n;
      this.tx = (c1 * this.ty - d1 * tx1) / n;
      this.ty = -(a1 * this.ty - b1 * tx1) / n;
      return this;
    }
    /**
     * Returns true if the matrix is an identity matrix.
     * @returns true if the matrix is an identity matrix
     */

  }, {
    key: "isIdentity",
    value: function isIdentity() {
      return this.tx === 0 && this.ty === 0 && this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1;
    }
    /**
     * Checks whether two matrixes are equal.
     * The result is true if and only if the argument is a Matrix2D object that has the same values.
     * @param matrix the Object to compare with this Matrix2D object.
     * @returns true if the objects are equal; false otherwise.
     */

  }, {
    key: "equals",
    value: function equals(matrix) {
      return this.tx === matrix.tx && this.ty === matrix.ty && this.a === matrix.a && this.b === matrix.b && this.c === matrix.c && this.d === matrix.d;
    }
    /**
     * Transforms a point according to this matrix.
     * @param x The x component of the point to transform
     * @param y The y component of the point to transform
     * @return the transformed point
     */

  }, {
    key: "transformPoint",
    value: function transformPoint(x, y) {
      var pt = new Point(0, 0);
      pt.x = x * this.a + y * this.c + this.tx;
      pt.y = x * this.b + y * this.d + this.ty;
      return pt;
    }
    /**
     * Copies all properties from the specified matrix to this matrix.
     * @param matrix The matrix to copy properties from
     * @returns The current instance. Useful for chaining method calls
     */

  }, {
    key: "copy",
    value: function copy(matrix) {
      return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    }
    /**
     * Returns a clone of the Matrix2D instance.
     * @returns a clone of the Matrix2D instance.
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
    }
    /**
     * Returns a string representation of this Matrix2D object.
     * @returns a string representation of this Matrix2D object
     */

  }, {
    key: "toString",
    value: function toString() {
      return "[Matrix2D (a=".concat(this.a, " b=").concat(this.b, " c=").concat(this.c, " d=").concat(this.d, " tx=").concat(this.tx, " ty=").concat(this.ty, ")]");
    }
  }]);

  return Matrix2D;
}();
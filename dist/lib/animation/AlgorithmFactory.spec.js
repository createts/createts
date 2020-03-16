"use strict";

var _AlgorithmFactory = require("./AlgorithmFactory");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

test('should register and return algorithm object', function () {
  var MyAlgo = /*#__PURE__*/function () {
    function MyAlgo() {
      _classCallCheck(this, MyAlgo);
    }

    _createClass(MyAlgo, [{
      key: "calculate",
      value: function calculate(percent) {
        return 1;
      }
    }]);

    return MyAlgo;
  }();

  var instance = new MyAlgo();

  _AlgorithmFactory.AlgorithmFactory.register('myalgo', instance);

  expect(_AlgorithmFactory.AlgorithmFactory.get('myalgo')).toBe(instance);
});
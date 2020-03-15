function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { AlgorithmFactory } from './AlgorithmFactory';
test('should register and return algorithm object', function () {
  var MyAlgo = /*#__PURE__*/function () {
    function MyAlgo() {
      _classCallCheck(this, MyAlgo);
    }

    _createClass(MyAlgo, [{
      key: "calclate",
      value: function calclate(percent) {
        return 1;
      }
    }]);

    return MyAlgo;
  }();

  var instance = new MyAlgo();
  AlgorithmFactory.register('myalgo', instance);
  expect(AlgorithmFactory.get('myalgo')).toBe(instance);
});
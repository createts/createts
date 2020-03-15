"use strict";

var _Event2 = require("./Event");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MyEvent = /*#__PURE__*/function (_Event) {
  _inherits(MyEvent, _Event);

  function MyEvent() {
    _classCallCheck(this, MyEvent);

    return _possibleConstructorReturn(this, _getPrototypeOf(MyEvent).apply(this, arguments));
  }

  return MyEvent;
}(_Event2.Event);

var MyEventDispatcher = /*#__PURE__*/function (_EventDispatcher) {
  _inherits(MyEventDispatcher, _EventDispatcher);

  function MyEventDispatcher() {
    _classCallCheck(this, MyEventDispatcher);

    return _possibleConstructorReturn(this, _getPrototypeOf(MyEventDispatcher).apply(this, arguments));
  }

  return MyEventDispatcher;
}(_Event2.EventDispatcher);

test('should been listened', function () {
  var dispatcher = new MyEventDispatcher();
  var listener1ToBeCalled = false;

  var listener1 = function listener1(e) {
    listener1ToBeCalled = true;
  };

  var listener2ToBeCalled = false;

  var listener2 = function listener2(e) {
    listener2ToBeCalled = true;
  };

  dispatcher.addEventListener('type1', listener1);
  dispatcher.addEventListener('type1', listener2);
  dispatcher.dispatchEvent(new MyEvent('type1'));
  expect(listener1ToBeCalled).toBe(true);
  expect(listener2ToBeCalled).toBe(true);
});
test('should remove the listener', function () {
  var dispatcher = new MyEventDispatcher();
  var listener1ToBeCalled = false;

  var listener1 = function listener1(e) {
    listener1ToBeCalled = true;
  };

  var listener2ToBeCalled = false;

  var listener2 = function listener2(e) {
    listener2ToBeCalled = true;
  };

  dispatcher.addEventListener('type1', listener1);
  dispatcher.addEventListener('type1', listener2);
  dispatcher.removeEventListener('type1', listener2);
  dispatcher.dispatchEvent(new MyEvent('type1'));
  expect(listener1ToBeCalled).toBe(true);
  expect(listener2ToBeCalled).toBe(false);
});
test('should remove all listeners', function () {
  var dispatcher = new MyEventDispatcher();
  var listener1ToBeCalled = false;

  var listener1 = function listener1(e) {
    listener1ToBeCalled = true;
  };

  var listener2ToBeCalled = false;

  var listener2 = function listener2(e) {
    listener2ToBeCalled = true;
  };

  dispatcher.addEventListener('type1', listener1);
  dispatcher.addEventListener('type1', listener2);
  dispatcher.removeAllEventListeners('type1');
  dispatcher.dispatchEvent(new MyEvent('type1'));
  expect(listener1ToBeCalled).toBe(false);
  expect(listener2ToBeCalled).toBe(false);
  dispatcher.addEventListener('type1', listener1);
  dispatcher.addEventListener('type1', listener2);
  dispatcher.removeAllEventListeners();
  dispatcher.dispatchEvent(new MyEvent('type1'));
  expect(listener1ToBeCalled).toBe(false);
  expect(listener2ToBeCalled).toBe(false);
});
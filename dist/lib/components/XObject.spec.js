"use strict";

var _MockCanvas = require("../utils/MockCanvas");

var _Container = require("./Container");

var _Stage = require("./Stage");

var _XObject = require("./XObject");

test('should calculate size of object', function () {
  var canvas = new _MockCanvas.MockCanvas();
  var stage = new _Stage.Stage(canvas.asCanvas());
  var obj = new _XObject.XObject();
  stage.addChild(obj);
  obj.css({
    width: 100,
    height: 200,
    padding: 2,
    border: '5px solid red',
    margin: '10 20'
  });
  obj.layout();
  expect(obj.getWidth()).toBe(114);
  expect(obj.getHeight()).toBe(214);
  expect(obj.getContentWidth()).toBe(100);
  expect(obj.getContentHeight()).toBe(200);
  expect(obj.getPaddingWidth()).toBe(104);
  expect(obj.getPaddingHeight()).toBe(204);
  expect(obj.getOuterWidth()).toBe(154);
  expect(obj.getOuterHeight()).toBe(234);
});
test('object can be added or removed', function () {
  var obj = new _XObject.XObject();
  var container = new _Container.Container();
  expect(obj.parent).toBeUndefined();
  container.addChild(obj);
  expect(obj.parent).toBe(container);
  obj.remove();
  expect(obj.parent).toBeUndefined();
});
test('object can be visible/invisible', function () {
  expect(new _XObject.XObject().isVisible()).toBe(true);
  expect(new _XObject.XObject().css({
    display: 'none'
  }).isVisible()).toBe(false);
  expect(new _XObject.XObject().css({
    alpha: 0
  }).isVisible()).toBe(false);
  expect(new _XObject.XObject().css({
    scale: 0
  }).isVisible()).toBe(false);
  expect(new _XObject.XObject().css({
    scaleX: 0
  }).isVisible()).toBe(false);
  expect(new _XObject.XObject().css({
    scaleY: 0
  }).isVisible()).toBe(false);
});
test('object can transform location between spaces', function () {
  var obj = new _XObject.XObject();
  obj.rect.x = 100;
  obj.rect.y = 200;
  expect(obj.globalToLocal(150, 150)).toEqual({
    x: 50,
    y: -50
  });
  var obj2 = new _XObject.XObject();
  obj2.rect.x = 200;
  obj2.rect.y = 100;
  expect(obj.localToLocal(10, 10, obj2)).toEqual({
    x: -90,
    y: 110
  });
});
test('hit test should work', function () {
  var obj = new _XObject.XObject();
  obj.rect.x = 100;
  obj.rect.y = 200;
  obj.rect.width = 50;
  obj.rect.height = 50;
  expect(obj.hitTest(20, 20)).toBe(true);
  expect(obj.hitTest(-10, 20)).toBe(false);
  expect(obj.hitTest(120, 20)).toBe(false);
});
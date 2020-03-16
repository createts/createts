"use strict";

var _Container = require("./Container");

var _XObject = require("./XObject");

test('container can add/remove child', function () {
  var child = new _XObject.XObject();
  var container = new _Container.Container();
  container.addChild(child);
  expect(child.parent).toBe(container);
  expect(container.children).toEqual([child]);
  child.remove();
  expect(child.parent).toBeUndefined();
  expect(container.children).toEqual([]);
  container.addChild(child);
  container.removeChild(child);
  expect(child.parent).toBeUndefined();
  expect(container.children).toEqual([]);
});
test('container can swap children', function () {
  var child1 = new _XObject.XObject();
  var child2 = new _XObject.XObject();
  var child3 = new _XObject.XObject();
  var container = new _Container.Container();
  container.addChildren(child1, child2, child3);
  expect(container.children).toEqual([child1, child2, child3]);
  container.swapChildrenAt(1, 2);
  expect(container.children).toEqual([child1, child3, child2]);
  container.swapChildren(child1, child2);
  expect(container.children).toEqual([child2, child3, child1]);
});
test('container find child', function () {
  var child1 = new _XObject.XObject();
  child1.id = 'child1';
  var child2 = new _XObject.XObject();
  var child3 = new _XObject.XObject();
  var container = new _Container.Container();
  container.addChildren(child1, child2, child3);
  expect(container.getChildAt(2)).toBe(child3);
  expect(container.getChildAt(4)).toBeUndefined();
  expect(container.getChildIndex(child2)).toBe(1);
  expect(container.getChildIndex(new _XObject.XObject())).toBe(-1);
  expect(container.findById('child1')).toBe(child1);
  expect(container.findById('child0')).toBeUndefined();
});
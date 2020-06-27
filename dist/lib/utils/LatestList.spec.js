"use strict";

var _LatestList = require("./LatestList");

test('should limit the size', function () {
  var list = new _LatestList.LatestList(3);
  list.add(0).add(1).add(2).add(3);
  expect(list.capacity).toEqual(3);
  expect(list.elements).toEqual([1, 2, 3]);
});
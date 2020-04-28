"use strict";

var _Ticker = require("./Ticker");

test('should start and stop', function () {
  return new Promise(function (resolve, reject) {
    var ticker = new _Ticker.Ticker();
    var times = 0;
    ticker.start();
    ticker.on('tick', function (e) {
      ++times;
    });
    setTimeout(function () {
      expect(times > 0).toBe(true);
      ticker.stop();
      times = 0;
      setTimeout(function () {
        expect(times).toBe(0);
        resolve();
      }, 200);
    }, 200);
  });
});
test('duration should be bigger than fps', function () {
  return new Promise(function (resolve, reject) {
    var ticker = new _Ticker.Ticker();
    var times = 0;
    ticker.setFps(10);
    ticker.start();
    ticker.on('tick', function (e) {
      expect(e.delay === 0 || e.delay >= 100).toBe(true); // Delay of first tick can be 0.

      ++times;

      if (times >= 10) {
        resolve();
      }
    });
  });
});
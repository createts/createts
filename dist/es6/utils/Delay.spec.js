import { Delay } from './Delay';
test('should delay the call', function () {
  var times = 0;
  var delay = new Delay(10);
  delay.call(function () {
    ++times;
  });
  expect(times).toEqual(0);
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      expect(times).toEqual(1);
      resolve();
    }, 20);
  });
});
test('should cancel the pending call', function () {
  var times = 0;
  var delay = new Delay(10);
  delay.call(function () {
    ++times;
  });
  expect(times).toEqual(0);
  setTimeout(function () {
    delay.call(function () {
      ++times;
    });
  }, 5);
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      expect(times).toEqual(1);
      resolve();
    }, 20);
  });
});
test('should pause/resume the pending call', function () {
  var times = 0;
  var delay = new Delay(10);
  delay.call(function () {
    ++times;
  });
  expect(times).toEqual(0);
  delay.pause();
  setTimeout(function () {
    expect(times).toEqual(0);
    delay.resume();
  }, 10);
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      expect(times).toEqual(1);
      resolve();
    }, 30);
  });
});
test('should cancel the pending call', function () {
  var times = 0;
  var delay = new Delay(10);

  var func = function func() {
    ++times;
  };

  delay.call(func);
  expect(delay.func).toBe(func);
  delay.cancel();
  expect(delay.func).toBeUndefined();
});
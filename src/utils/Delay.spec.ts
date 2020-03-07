import { Delay } from './Delay';

test('should delay the call', () => {
  let times = 0;
  const delay = new Delay(10);
  delay.call(() => {
    ++times;
  });
  expect(times).toEqual(0);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      expect(times).toEqual(1);
      resolve();
    }, 20);
  });
});

test('should cancel the pending call', () => {
  let times = 0;
  const delay = new Delay(10);
  delay.call(() => {
    ++times;
  });
  expect(times).toEqual(0);
  setTimeout(() => {
    delay.call(() => {
      ++times;
    });
  }, 5);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      expect(times).toEqual(1);
      resolve();
    }, 20);
  });
});

test('should pause/resume the pending call', () => {
  let times = 0;
  const delay = new Delay(10);
  delay.call(() => {
    ++times;
  });
  expect(times).toEqual(0);
  delay.pause();
  setTimeout(() => {
    expect(times).toEqual(0);
    delay.resume();
  }, 10);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      expect(times).toEqual(1);
      resolve();
    }, 30);
  });
});

test('should cancel the pending call', () => {
  let times = 0;
  const delay = new Delay(10);
  const func = () => {
    ++times;
  };
  delay.call(func);
  expect((delay as any).func).toBe(func);
  delay.cancel();
  expect((delay as any).func).toBeUndefined();
});

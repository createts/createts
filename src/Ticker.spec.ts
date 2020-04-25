import { Ticker } from './Ticker';

test('should start and stop', () => {
  return new Promise((resolve, reject) => {
    const ticker = new Ticker();
    let times = 0;
    ticker.start();
    ticker.on('tick', e => {
      ++times;
    });
    setTimeout(() => {
      expect(times > 0).toBe(true);
      ticker.stop();
      times = 0;
      setTimeout(() => {
        expect(times).toBe(0);
        resolve();
      }, 200);
    }, 200);
  });
});

test('duration should be bigger than fps', () => {
  return new Promise((resolve, reject) => {
    const ticker = new Ticker();
    let times = 0;
    ticker.setFps(10);
    ticker.start();
    ticker.on('tick', e => {
      expect(e.delay >= 100).toBe(true);
      ++times;
      if (times >= 10) {
        resolve();
      }
    });
  });
});

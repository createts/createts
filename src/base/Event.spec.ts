import { Event, EventDispatcher } from './Event';

class MyEvent extends Event {}

class MyEventDispatcher extends EventDispatcher<MyEvent> {}

test('should been listened', () => {
  const dispatcher = new MyEventDispatcher();
  let listener1ToBeCalled = false;
  const listener1 = (e: MyEvent) => {
    listener1ToBeCalled = true;
  };
  let listener2ToBeCalled = false;
  const listener2 = (e: MyEvent) => {
    listener2ToBeCalled = true;
  };

  dispatcher.addEventListener('type1', listener1);
  dispatcher.addEventListener('type1', listener2);

  dispatcher.dispatchEvent(new MyEvent('type1'));
  expect(listener1ToBeCalled).toBe(true);
  expect(listener2ToBeCalled).toBe(true);
});

test('should remove the listener', () => {
  const dispatcher = new MyEventDispatcher();
  let listener1ToBeCalled = false;
  const listener1 = (e: MyEvent) => {
    listener1ToBeCalled = true;
  };
  let listener2ToBeCalled = false;
  const listener2 = (e: MyEvent) => {
    listener2ToBeCalled = true;
  };

  dispatcher.addEventListener('type1', listener1);
  dispatcher.addEventListener('type1', listener2);
  dispatcher.removeEventListener('type1', listener2);

  dispatcher.dispatchEvent(new MyEvent('type1'));
  expect(listener1ToBeCalled).toBe(true);
  expect(listener2ToBeCalled).toBe(false);
});

test('should remove all listeners', () => {
  const dispatcher = new MyEventDispatcher();
  let listener1ToBeCalled = false;
  const listener1 = (e: MyEvent) => {
    listener1ToBeCalled = true;
  };
  let listener2ToBeCalled = false;
  const listener2 = (e: MyEvent) => {
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

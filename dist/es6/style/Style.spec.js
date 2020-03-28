import { BaseValue } from '../base/BaseValue';
import { Style } from './Style';
test('should apply new styles', function () {
  var style = new Style();
  style.apply({
    width: 100,
    height: '100%'
  });
  expect(style.width).toEqual(BaseValue.of('100'));
  expect(style.height).toEqual(BaseValue.of('100%'));
});
test('should be cloned', function () {
  var style = new Style();
  style.apply({
    width: 100,
    height: '100%'
  });
  expect(style).toEqual(style.clone());
});
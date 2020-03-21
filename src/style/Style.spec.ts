import { BaseValue } from '../base/BaseValue';
import { Color } from '../base/Color';
import { Shadow } from './Shadow';
import { Style } from './Style';

test('should apply new styles', () => {
  const style = new Style();
  style.apply({ width: 100, height: '100%' });
  expect(style.width).toEqual(BaseValue.of('100'));
  expect(style.height).toEqual(BaseValue.of('100%'));
});

test('should be cloned', () => {
  const style = new Style();
  style.apply({ width: 100, height: '100%' });
  expect(style).toEqual(style.clone());
});

import { BaseValue } from '../base';
import { StyleUtils } from './StyleUtils';
test('should parse single value', function () {
  expect(StyleUtils.parse4Dirs('10')).toEqual([BaseValue.of(10), BaseValue.of(10), BaseValue.of(10), BaseValue.of(10)]);
  expect(StyleUtils.parse4Dirs('10%')).toEqual([BaseValue.of('10%'), BaseValue.of('10%'), BaseValue.of('10%'), BaseValue.of('10%')]);
});
test('should parse 2 values', function () {
  expect(StyleUtils.parse4Dirs('10 20')).toEqual([BaseValue.of(10), BaseValue.of(20), BaseValue.of(10), BaseValue.of(20)]);
  expect(StyleUtils.parse4Dirs('10% 20%')).toEqual([BaseValue.of('10%'), BaseValue.of('20%'), BaseValue.of('10%'), BaseValue.of('20%')]);
});
test('should parse 3 values', function () {
  expect(StyleUtils.parse4Dirs('10 20 30')).toEqual([BaseValue.of(10), BaseValue.of(20), BaseValue.of(30), BaseValue.of(20)]);
  expect(StyleUtils.parse4Dirs('10% 20% 30%')).toEqual([BaseValue.of('10%'), BaseValue.of('20%'), BaseValue.of('30%'), BaseValue.of('20%')]);
});
test('should parse 4 values', function () {
  expect(StyleUtils.parse4Dirs('10 20 30 40')).toEqual([BaseValue.of(10), BaseValue.of(20), BaseValue.of(30), BaseValue.of(40)]);
  expect(StyleUtils.parse4Dirs('10% 20% 30% 40%')).toEqual([BaseValue.of('10%'), BaseValue.of('20%'), BaseValue.of('30%'), BaseValue.of('40%')]);
});
test('should ignore bad values', function () {
  expect(StyleUtils.parse4Dirs('a b c d e')).toBeUndefined();
});
import { EnumUtils } from './EnumUtils';
var TestEnum;

(function (TestEnum) {
  TestEnum["V1"] = "v1";
  TestEnum["V2"] = "v2";
})(TestEnum || (TestEnum = {}));

test('should convert string to TestEnum', function () {
  expect(EnumUtils.fromString(TestEnum, 'v1', TestEnum.V2)).toEqual(TestEnum.V1);
  expect(EnumUtils.fromString(TestEnum, 'v2', TestEnum.V2)).toEqual(TestEnum.V2);
  expect(EnumUtils.fromString(TestEnum, 'v', TestEnum.V2)).toEqual(TestEnum.V2);
});
test('should convert string to TestEnum or undefined', function () {
  expect(EnumUtils.fromStringOrUndefined(TestEnum, 'v1')).toEqual(TestEnum.V1);
  expect(EnumUtils.fromStringOrUndefined(TestEnum, 'v2')).toEqual(TestEnum.V2);
  expect(EnumUtils.fromStringOrUndefined(TestEnum, 'v')).toBeUndefined();
});
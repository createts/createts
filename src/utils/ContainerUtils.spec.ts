import { ContainerUtils } from './ContainerUtils';

test('should check empty map', () => {
  expect(ContainerUtils.isEmpty(undefined)).toBe(true);
  expect(ContainerUtils.isEmpty({})).toBe(true);
  expect(ContainerUtils.isEmpty({ a: 1 })).toBe(false);
});

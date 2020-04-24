import { URLUtils } from './URLUtils';

test('should check url types', () => {
  expect(URLUtils.isAbsolute('https://a.com/')).toBe(true);
  expect(URLUtils.isAbsolute('/a.com/')).toBe(false);
});

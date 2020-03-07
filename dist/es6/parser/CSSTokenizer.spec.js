import { CSSTokenizer } from './CSSTokenizer';
test('should tokenize the value', function () {
  expect(new CSSTokenizer().tokenize('')).toEqual([]);
  expect(new CSSTokenizer().tokenize('  ')).toEqual([]);
  expect(new CSSTokenizer().tokenize('abc')).toEqual(['abc']);
  expect(new CSSTokenizer().tokenize(' abc')).toEqual(['abc']);
  expect(new CSSTokenizer().tokenize(' abc  ')).toEqual(['abc']);
  expect(new CSSTokenizer().tokenize('a')).toEqual(['a']);
  expect(new CSSTokenizer().tokenize('test()')).toEqual(['test()']);
  expect(new CSSTokenizer().tokenize('abc def')).toEqual(['abc', 'def']);
  expect(new CSSTokenizer().tokenize('ab cd ef ')).toEqual(['ab', 'cd', 'ef']);
  expect(new CSSTokenizer().tokenize('abc test(1, 2,  3 )')).toEqual(['abc', 'test(1, 2,  3 )']);
  expect(new CSSTokenizer().tokenize('abc "def"')).toEqual(['abc', 'def']);
  expect(new CSSTokenizer().tokenize("ab 'cd' ef ")).toEqual(['ab', 'cd', 'ef']);
  expect(new CSSTokenizer().tokenize('"abc test(1, 2,  3 )"')).toEqual(['abc test(1, 2,  3 )']);
  expect(new CSSTokenizer().tokenize('abc "test(1, 2,  3 )"')).toEqual(['abc', 'test(1, 2,  3 )']);
  expect(new CSSTokenizer().tokenize('abc "test(1, 2,  3 )')).toEqual(['abc', 'test(1, 2,  3 )']);
});
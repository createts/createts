"use strict";

var _FunctionParser = require("./FunctionParser");

test('should parse function without parameter', function () {
  expect(_FunctionParser.FunctionParser.parse('test()')).toEqual({
    name: 'test',
    arguments: []
  });
  expect(_FunctionParser.FunctionParser.parse(' test() ')).toEqual({
    name: 'test',
    arguments: []
  });
  expect(_FunctionParser.FunctionParser.parse('  test( )')).toEqual({
    name: 'test',
    arguments: []
  });
  expect(_FunctionParser.FunctionParser.parse('   test ()', true)).toBe(undefined);
  expect(_FunctionParser.FunctionParser.parse('     123test()')).toEqual({
    name: '123test',
    arguments: []
  });
  expect(_FunctionParser.FunctionParser.parse('test', true)).toBe(undefined);
  expect(_FunctionParser.FunctionParser.parse('test(', true)).toBe(undefined);
  expect(_FunctionParser.FunctionParser.parse('', true)).toBe(undefined);
  expect(_FunctionParser.FunctionParser.parse(' ', true)).toBe(undefined);
});
test('should parse function with parameter', function () {
  expect(_FunctionParser.FunctionParser.parse('test(1)')).toEqual({
    name: 'test',
    arguments: ['1']
  });
  expect(_FunctionParser.FunctionParser.parse(' test(1, 2, 3)')).toEqual({
    name: 'test',
    arguments: ['1', '2', '3']
  });
  expect(_FunctionParser.FunctionParser.parse('  test("1", 2 )')).toEqual({
    name: 'test',
    arguments: ['1', '2']
  });
  expect(_FunctionParser.FunctionParser.parse('  test("hello,", world )    ')).toEqual({
    name: 'test',
    arguments: ['hello,', 'world']
  });
  expect(_FunctionParser.FunctionParser.parse('  test(1,2,3 )    ')).toEqual({
    name: 'test',
    arguments: ['1', '2', '3']
  });
  expect(_FunctionParser.FunctionParser.parse('linear-gradient(to top, #333, #333 50%, #eee 75%, #333 75%)')).toEqual({
    name: 'linear-gradient',
    arguments: ['to top', '#333', '#333 50%', '#eee 75%', '#333 75%']
  });
});
import { AlgorithmFactory, IAlgorithm } from './AlgorithmFactory';

test('should register and return algorithm object', () => {
  class MyAlgo implements IAlgorithm {
    calculate(percent: number): number {
      return 1;
    }
  }
  const instance = new MyAlgo();
  AlgorithmFactory.register('myalgo', instance);
  expect(AlgorithmFactory.get('myalgo')).toBe(instance);
});

import { describe, it, expect } from 'vitest';
import { checkIfSymbolAdjacent, checkIfPartNumber } from './day03';
describe('day03', () => {
  const testData = [
    ['4', '6', '7', '.', '.', '1', '1', '4', '.', '.'],
    ['.', '.', '.', '*', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '3', '5', '.', '.', '6', '3', '3', '.'],
    ['.', '.', '.', '.', '.', '.', '#', '.', '.', '.'],
    ['6', '1', '7', '*', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '+', '.', '5', '8', '.'],
    ['.', '.', '5', '9', '2', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '7', '5', '5', '.'],
    ['.', '.', '.', '$', '.', '*', '.', '.', '.', '.'],
    ['.', '6', '6', '4', '.', '5', '9', '8', '.', '.'],
  ];

  const n = testData.length;
  const m = testData[0].length;

  describe('checkIfSymbolAdjacent', () => {
    it('returns false when a digit has no adjacent symbol', () => {
      const result = checkIfSymbolAdjacent(testData, 6, 2);
      expect(result).toBe(false);
    });

    it('returns true when a digit has an adjacent symbol', () => {
      const result = checkIfSymbolAdjacent(testData, 4, 2);
      expect(result).toBe(true);
    });

    it('returns false when cell is a symbol', () => {
      const result = checkIfSymbolAdjacent(testData, 6, 2);
      expect(result).toBe(false);
    });

    it('returns false when cell is a dot', () => {
      const result = checkIfSymbolAdjacent(testData, 9, 4);
      expect(result).toBe(false);
    });

    it('does not throw when cell is on the edge', () => {
      for (const [i, j] of [
        [0, 0],
        [n - 1, 0],
        [0, m - 1],
        [n - 1, m - 1],
      ]) {
        expect(() => checkIfSymbolAdjacent(testData, i, j)).not.toThrowError();
      }
    });
  });

  describe('checkIfPartNumber', () => {
    it('returns true when number is a part number', () => {
      expect(checkIfPartNumber(testData, 7, 6, 9)).toBe(true);
    });

    it('returns false when number is not a part number', () => {
      expect(checkIfPartNumber(testData, 0, 5, 8)).toBe(false);
    });
  });
});

import { it, describe, expect } from 'vitest';
import { parseInput } from './index';
import input from './input';
import { Range, mapSource } from './day05';

describe('mapSource', () => {
  const x = 79;
  const y = 92;
  const length = 14;

  it('should return empty array if no overlap', () => {
    const mapping: Range = { source: 98, destination: 50, length: 2 };
    const result = mapSource(x, y, length, mapping);
    expect(result).toStrictEqual([]);
  });

  it('should return one result if source inside mapping', () => {
    const mapping: Range = { source: 50, destination: 52, length: 48 };
    const result = mapSource(x, y, length, mapping);
    expect(result).toHaveLength(1);
    expect(result).toStrictEqual([{ source: 81, length: 14 }]);
  });

  it('should return two results if mapping overlaps source from its right', () => {
    const [x, y] = [74, 87];
    const mapping: Range = { source: 77, destination: 45, length: 23 };
    const result = mapSource(x, y, length, mapping);
    expect(result).toHaveLength(2);
    expect(result).toStrictEqual([
      { source: 74, length: 3 },
      { source: 45, length: 11 },
    ]);
  });

  it('should return two results if mapping overlaps source from its left', () => {
    const [x, y] = [74, 87];
    const length = 14;
    const mapping: Range = { source: 64, destination: 68, length: 13 };
    const result = mapSource(x, y, length, mapping);
    expect(result).toHaveLength(2);
    expect(result).toStrictEqual([
      { source: 78, length: 3 },
      { source: 77, length: 11 },
    ]);
  });

  it('should return three results if mapping inside source', () => {
    const [x, y] = [55, 67];
    const mapping: Range = { source: 60, destination: 22, length: 5 };
    const length = 13;
    const result = mapSource(x, y, length, mapping);

    expect(result).toHaveLength(3);
    expect(result).toStrictEqual([
      {
        source: 55,
        length: 5,
      },
      {
        source: 22,
        length: 5,
      },
      {
        source: 65,
        length: 3,
      },
    ]);
  });
});

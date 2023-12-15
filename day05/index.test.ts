import { it, describe, expect } from 'vitest';
import { Mapping, Range, mapRange } from './index';

describe('mapRange', () => {
  const range: Range = { source: 79, length: 14 };

  it('should return empty array if no overlap', () => {
    const mapping: Mapping = { source: 98, destination: 50, length: 2 };
    const result = mapRange(range, mapping);
    expect(result).toStrictEqual([]);
  });

  it('should return one result if source inside mapping', () => {
    const mapping: Mapping = { source: 50, destination: 52, length: 48 };
    const result = mapRange(range, mapping);
    expect(result).toHaveLength(1);
    expect(result).toStrictEqual([{ source: 81, length: 14 }]);
  });

  it('should return two results if mapping overlaps source from its right', () => {
    const range: Range = { source: 74, length: 14 };
    const mapping: Mapping = { source: 77, destination: 45, length: 23 };
    const result = mapRange(range, mapping);
    expect(result).toHaveLength(2);
    expect(result).toStrictEqual([
      { source: 74, length: 3 },
      { source: 45, length: 11 },
    ]);
  });

  it('should return two results if mapping overlaps source from its left', () => {
    const range: Range = { source: 74, length: 14 };
    const mapping: Mapping = { source: 64, destination: 68, length: 13 };
    const result = mapRange(range, mapping);
    expect(result).toHaveLength(2);
    expect(result).toStrictEqual([
      { source: 78, length: 3 },
      { source: 77, length: 11 },
    ]);
  });

  it('should return three results if mapping inside source', () => {
    const range: Range = { source: 55, length: 13 };
    const mapping: Mapping = { source: 60, destination: 22, length: 5 };
    const result = mapRange(range, mapping);

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

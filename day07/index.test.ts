import { describe, it, expect } from 'vitest';
import { getHandValue } from '.';

describe('getHandValue', () => {
  describe('part1', () => {
    it('returns right values when no jokers in hand', () => {
      const hand1 = '12345';
      expect(getHandValue(hand1)).toBe(0);

      const hand2 = '77TA2';
      expect(getHandValue(hand2)).toBe(1);

      const hand3 = '99877';
      expect(getHandValue(hand3)).toBe(2);

      const hand4 = '333AQ';
      expect(getHandValue(hand4)).toBe(3);

      const hand5 = '44499';
      expect(getHandValue(hand5)).toBe(4);

      const hand6 = 'QQQQ7';
      expect(getHandValue(hand6)).toBe(5);

      const hand7 = 'AAAAA';
      expect(getHandValue(hand7)).toBe(6);
    });

    it('returns good values when jokers in hand', () => {
      const hand1 = 'J2345';
      expect(getHandValue(hand1)).toBe(0);

      const hand2 = '77TJ2';
      expect(getHandValue(hand2)).toBe(1);

      const hand3 = '99TT5';
      expect(getHandValue(hand3)).toBe(2);

      const hand4 = 'J3223';
      expect(getHandValue(hand4)).toBe(2);

      const hand5 = 'JJJ58';
      expect(getHandValue(hand5)).toBe(3);

      const hand6 = 'QQQJJ';
      expect(getHandValue(hand6)).toBe(4);

      const hand7 = 'JJTTK';
      expect(getHandValue(hand7)).toBe(2);

      const hand8 = 'JJJJ2';
      expect(getHandValue(hand8)).toBe(5);

      const hand9 = 'JJJJJ';
      expect(getHandValue(hand9)).toBe(6);
    });
  });

  describe('part2', () => {
    it('returns right values when no jokers in hand', () => {
      const hand1 = '12345';
      expect(getHandValue(hand1, true)).toBe(0);

      const hand2 = '77TA2';
      expect(getHandValue(hand2, true)).toBe(1);

      const hand3 = '99877';
      expect(getHandValue(hand3, true)).toBe(2);

      const hand4 = '333AQ';
      expect(getHandValue(hand4, true)).toBe(3);

      const hand5 = '44499';
      expect(getHandValue(hand5, true)).toBe(4);

      const hand6 = 'QQQQ7';
      expect(getHandValue(hand6, true)).toBe(5);

      const hand7 = 'AAAAA';
      expect(getHandValue(hand7, true)).toBe(6);
    });

    it('returns good values when jokers in hand', () => {
      const hand1 = 'J2345';
      expect(getHandValue(hand1, true)).toBe(1);

      const hand2 = '77TJ2';
      expect(getHandValue(hand2, true)).toBe(3);

      const hand3 = '99TT5';
      expect(getHandValue(hand3, true)).toBe(2);

      const hand4 = 'J3223';
      expect(getHandValue(hand4, true)).toBe(4);

      const hand5 = 'JJJ58';
      expect(getHandValue(hand5, true)).toBe(5);

      const hand6 = 'QQQJ9';
      expect(getHandValue(hand6, true)).toBe(5);

      const hand7 = 'JJTTK';
      expect(getHandValue(hand7, true)).toBe(5);

      const hand8 = 'JJJJ2';
      expect(getHandValue(hand8, true)).toBe(6);

      const hand9 = 'JJJJJ';
      expect(getHandValue(hand9, true)).toBe(6);
    });
  });
});

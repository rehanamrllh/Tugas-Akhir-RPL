import { describe, it, expect } from 'vitest';
import { formatRp, formatDate } from './utils';

describe('utils', () => {
  describe('formatRp', () => {
    it('formats number to Indonesian Rupiah currency', () => {
      expect(formatRp(10000)).toBe('Rp 10.000');
      expect(formatRp(0)).toBe('Rp 0');
      expect(formatRp(1500000)).toBe('Rp 1.500.000');
    });
  });

  describe('formatDate', () => {
    it('formats ISO date string to readable format', () => {
      // Mock timezone by using a specific Date
      const date = new Date('2023-10-15T14:30:00.000Z');
      const formatted = formatDate(date.toISOString());
      
      const expectedDay = date.getDate();
      const expectedMonth = date.getMonth() + 1;
      const expectedYear = date.getFullYear();
      const expectedHour = date.getHours().toString().padStart(2, '0');
      const expectedMinute = date.getMinutes().toString().padStart(2, '0');
      
      const expectedFormat = `${expectedDay}/${expectedMonth}/${expectedYear}, ${expectedHour}:${expectedMinute}`;
      expect(formatted).toBe(expectedFormat);
    });
  });
});

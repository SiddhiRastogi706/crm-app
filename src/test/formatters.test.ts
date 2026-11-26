import { describe, it, expect } from 'vitest';
import { formatCurrency, formatCompactNumber, formatDate, formatRelativeTime } from '@/utils/formatters';

describe('Formatters Utility', () => {
  it('formats currency correctly without cents defaulting to INR', () => {
    expect(formatCurrency(125000)).toBe('₹1,25,000');
    expect(formatCurrency(0)).toBe('₹0');
  });

  it('formats explicit currency when passed', () => {
    expect(formatCurrency(125000, 'USD')).toBe('$125,000');
  });

  it('formats compact numbers with k and M suffix', () => {
    expect(formatCompactNumber(1500)).toBe('1.5K');
    expect(formatCompactNumber(2500000)).toBe('2.5M');
  });

  it('formats date strings', () => {
    expect(formatDate('2026-11-23')).toContain('2026');
    expect(formatDate(undefined)).toBe('-');
  });

  it('formats relative times for recent events', () => {
    const justNow = new Date().toISOString();
    expect(formatRelativeTime(justNow)).toBe('Just now');
  });
});

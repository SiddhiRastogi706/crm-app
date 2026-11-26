import { describe, it, expect } from 'vitest';
import { parseCSV } from '@/utils/export';

describe('CSV Parsing Utility', () => {
  it('parses standard CSV format into headers and rows', () => {
    const csv = `Name,Email,Company,Value\nJohn Doe,john@test.com,Acme Corp,50000\nJane Smith,jane@test.com,Beta Inc,75000`;
    const result = parseCSV(csv);

    expect(result.headers).toEqual(['Name', 'Email', 'Company', 'Value']);
    expect(result.rows).toHaveLength(2);
    expect(result.rows[0]).toEqual(['John Doe', 'john@test.com', 'Acme Corp', '50000']);
  });

  it('handles empty csv string gracefully', () => {
    const result = parseCSV('');
    expect(result.headers).toEqual([]);
    expect(result.rows).toEqual([]);
  });
});

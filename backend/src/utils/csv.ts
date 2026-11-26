import { format } from 'fast-csv';
import { Readable } from 'stream';

export interface CsvImportResult<T> {
  validRows: T[];
  errors: Array<{ row: number; errors: string[] }>;
  totalProcessed: number;
}

export const generateCsv = async <T extends Record<string, any>>(data: T[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const csvStream = format({ headers: true });
    let output = '';

    csvStream.on('data', (chunk) => {
      output += chunk.toString();
    });

    csvStream.on('end', () => {
      resolve(output);
    });

    csvStream.on('error', (err) => {
      reject(err);
    });

    data.forEach((row) => csvStream.write(row));
    csvStream.end();
  });
};

export const parseCsvBuffer = async (buffer: Buffer): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    const stream = Readable.from(buffer);
    const fastCsv = require('fast-csv');

    stream
      .pipe(fastCsv.parse({ headers: true, trim: true }))
      .on('data', (data: any) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err: any) => reject(err));
  });
};

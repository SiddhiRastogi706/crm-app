import { beforeEach } from 'vitest';
import { dbStore } from '../src/repositories/dbStore';

beforeEach(() => {
  dbStore.reset();
});

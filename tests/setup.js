import { beforeAll, afterAll } from '@jest/globals';

beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

afterAll(() => {
  // Limpieza global si es necesaria
});

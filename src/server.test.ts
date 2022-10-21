import { server } from './server';
import superTest from 'supertest';
import { initDb, seedDb } from './utils/test-utils';

describe('server', () => {
  it('should launch', () => {
    expect(server.launch).toBeDefined();
  });

  it('should close', () => {
    expect(server.close).toBeDefined();
  });

  it('/openapi should return the api yml', async () => {
    const res = await superTest(server.app).get('/openapi');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('openapi: 3.0.0');
  });

  it('/hello should return a string containing "Hello World"', async () => {
    const res = await superTest(server.app).get('/hello');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Hello World');
  });
});

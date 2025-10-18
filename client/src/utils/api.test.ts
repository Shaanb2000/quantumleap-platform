import { api } from './api';

describe('API utility', () => {
  it('should have correct base URL', () => {
    expect(api.defaults.baseURL).toBe('http://localhost:5000/api');
  });

  it('should be defined', () => {
    expect(api).toBeDefined();
  });
});

// Mock axios before importing
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn()
    },
    response: {
      use: jest.fn()
    }
  },
  defaults: { baseURL: 'http://localhost:5000/api' }
};

jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance),
  defaults: { baseURL: 'http://localhost:5000/api' }
}));

import { api } from './api';

describe('API utility', () => {
  it('should have correct base URL', () => {
    expect(api.defaults.baseURL).toBe('http://localhost:5000/api');
  });

  it('should be defined', () => {
    expect(api).toBeDefined();
  });
});

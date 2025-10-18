import { api } from './api';

// Mock fetch
global.fetch = jest.fn();

describe('API utility', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should have correct base URL', () => {
    expect(api.defaults.baseURL).toBe('http://localhost:5000/api');
  });

  it('should make GET request', async () => {
    const mockResponse = { data: 'test' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const response = await api.get('/test');
    expect(response.data).toBe('test');
  });

  it('should make POST request', async () => {
    const mockResponse = { success: true };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const response = await api.post('/test', { data: 'test' });
    expect(response.data).toBe(mockResponse);
  });
});

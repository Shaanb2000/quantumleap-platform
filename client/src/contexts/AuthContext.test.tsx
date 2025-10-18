import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from './AuthContext';

// Mock axios
jest.mock('axios', () => ({
  create: () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    defaults: { baseURL: 'http://localhost:5000/api' }
  }),
  defaults: { baseURL: 'http://localhost:5000/api' }
}));

// Simple test component
const TestComponent = () => <div>Test</div>;

describe('AuthContext', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(container).toBeTruthy();
  });
});

import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider } from './AuthContext';

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

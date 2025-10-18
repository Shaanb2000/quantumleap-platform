import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Test component to access the context
const TestComponent = () => {
  const { user, loading } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? user.name : 'No user'}</div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not loading'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  it('provides initial context values', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
  });
});

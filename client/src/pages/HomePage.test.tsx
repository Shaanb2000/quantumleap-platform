import React from 'react';
import { render } from '@testing-library/react';
import HomePage from './HomePage';

// Mock the AuthContext
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    loading: false,
    isAuthenticated: false
  })
}));

// Mock React Router
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to?: string }) => <a href={to}>{children}</a>
}));

describe('HomePage', () => {
  it('renders without crashing', () => {
    const { container } = render(<HomePage />);
    expect(container).toBeTruthy();
  });
});

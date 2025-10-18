import React from 'react';
import { render } from '@testing-library/react';
import Navbar from './Navbar';

// Mock the AuthContext
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    loading: false
  })
}));

// Mock the ThemeContext
jest.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn()
  })
}));

// Mock React Router
jest.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to?: string }) => <a href={to}>{children}</a>,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' })
}));

describe('Navbar', () => {
  it('renders without crashing', () => {
    const { container } = render(<Navbar />);
    expect(container).toBeTruthy();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
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

describe('Navbar', () => {
  it('renders the navbar', () => {
    render(<Navbar />);
    
    // Check for navbar elements
    expect(screen.getByText(/QuantumLeap/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Navbar />);
    
    // Check for navigation links
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

// Mock the AuthContext
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    loading: false
  })
}));

describe('HomePage', () => {
  it('renders the homepage content', () => {
    render(<HomePage />);
    
    // Check for key elements that should be on the homepage
    expect(screen.getByText(/QuantumLeap/i)).toBeInTheDocument();
    expect(screen.getByText(/Project-Based Future-Skill Incubator/i)).toBeInTheDocument();
  });

  it('renders sign up and login buttons', () => {
    render(<HomePage />);
    
    // Check for navigation buttons
    const signUpButton = screen.getByRole('link', { name: /sign up/i });
    const loginButton = screen.getByRole('link', { name: /login/i });
    
    expect(signUpButton).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { useAuth } from '../context/AuthContext';
import HomePage from './HomePage';

jest.mock('../context/AuthContext');
jest.mock('../FirebaseConfig'); // Ensure the mock from __mocks__ is used

jest.mock('./DashboardPage', () => () => <div>Dashboard</div>);

describe('HomePage', () => {
  it('renders welcome message when user is not authenticated', () => {
    useAuth.mockReturnValue({ user: null });
    render(<HomePage />);
    expect(screen.getByText(/Welcome to SwiitchBank/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.queryByText(/Dashboard/i)).not.toBeInTheDocument();
  });

  it('renders DashboardPage when user is authenticated', () => {
    useAuth.mockReturnValue({ user: { email: 'test@example.com' } });
    render(<HomePage />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.queryByText(/Welcome to SwiitchBank/i)).not.toBeInTheDocument();
  });
});
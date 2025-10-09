import React from 'react';
import { render, screen } from '@testing-library/react';
import { useAuth } from '../context/AuthContext';
import HomePage from './HomePage';

jest.mock('../context/AuthContext');

describe('HomePage', () => {
  it('renders welcome message when user is not authenticated', () => {
    useAuth.mockReturnValue({ user: null });
    render(<HomePage />);
    expect(screen.getByText(/Welcome to SwiitchBank/i)).toBeInTheDocument();
  });
});
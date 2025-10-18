import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';
import { useAuth } from '../context/AuthContext';

// Mock the useAuth hook
jest.mock('../context/AuthContext');

describe('HomePage', () => {
  it('renders Welcome component when user is not authenticated', () => {
    useAuth.mockReturnValue({ user: null });
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    // Assuming Welcome component has a distinctive text
    expect(screen.getByText(/Welcome to SwiitchBank/i)).toBeInTheDocument();
  });

  it('renders DashboardPage when user is authenticated', async () => {
    useAuth.mockReturnValue({ user: { email: 'test@example.com' } });
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    await waitFor(() => {
        // The DashboardPage component renders the text "My Dashboard"
        expect(screen.getByText(/My Dashboard/i)).toBeInTheDocument();
    });
  });
});
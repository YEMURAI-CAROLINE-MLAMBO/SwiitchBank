import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';
import { useAuth, apiClient } from '../context/AuthContext';

// Mock the useAuth hook and apiClient
jest.mock('../context/AuthContext', () => ({
  ...jest.requireActual('../context/AuthContext'),
  useAuth: jest.fn(),
  apiClient: {
    get: jest.fn(),
  },
}));

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
    apiClient.get.mockResolvedValue({
      data: {
        netWorth: { totalNetWorth: 1000, baseCurrency: 'USD' },
        monthlySpending: 500,
        recentIncome: 1000,
      },
    });
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/My Dashboard/i)).toBeInTheDocument();
    });
  });
});
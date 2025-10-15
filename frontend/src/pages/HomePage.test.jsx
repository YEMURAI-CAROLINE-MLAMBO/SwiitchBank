import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useAuth } from '../context/AuthContext';
import HomePage from './HomePage';

jest.mock('../context/AuthContext');
jest.mock('../FirebaseConfig'); // Ensure the mock from __mocks__ is used

// The MultiCurrencyDashboard is not rendered by HomePage, so this mock is not needed.
// jest.mock('../components/MultiCurrencyDashboard.jsx', () => () => <div>Global Financial Overview</div>);

describe('HomePage', () => {
  it('renders welcome message when user is not authenticated', async () => {
    useAuth.mockReturnValue({ user: null });
    render(<HomePage />);
    expect(screen.getByText(/Welcome to SwiitchBank/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.queryByText(/Dashboard/i)).not.toBeInTheDocument();
  });

  it('renders DashboardPage when user is authenticated', async () => {
    useAuth.mockReturnValue({ user: { email: 'test@example.com' } });
    render(<HomePage />);
    await waitFor(() => {
        // The DashboardPage component renders the text "Dashboard"
        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/Welcome to Sw-iitchBank/i)).not.toBeInTheDocument();
  });
});

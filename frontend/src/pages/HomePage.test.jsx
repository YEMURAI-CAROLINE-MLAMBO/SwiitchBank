import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';
import { useAuth } from '../context/AuthContext';
import WalletDashboard from '../components/wallet/WalletDashboard';

jest.mock('../context/AuthContext');
jest.mock('../components/wallet/WalletDashboard', () => () => <div data-testid="wallet-dashboard"></div>);

describe('HomePage', () => {
  it('renders welcome message when user is not authenticated', () => {
    useAuth.mockReturnValue({ user: null });
    render(<HomePage />);
    expect(screen.getByText('Welcome to SwiitchBank')).toBeInTheDocument();
  });

  it('renders WalletDashboard when user is authenticated', () => {
    useAuth.mockReturnValue({ user: { uid: '123' } });
    render(<HomePage />);
    expect(screen.getByTestId('wallet-dashboard')).toBeInTheDocument();
  });
});
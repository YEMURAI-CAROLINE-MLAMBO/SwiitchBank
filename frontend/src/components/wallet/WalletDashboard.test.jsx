import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import WalletDashboard from './WalletDashboard';
import { useAuth } from '../../context/AuthContext';
import { onSnapshot } from 'firebase/firestore';

// Mock the AuthContext and Firestore's onSnapshot
jest.mock('../../context/AuthContext');
jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'), // keep other firestore exports
  onSnapshot: jest.fn(),
  doc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
}));

const mockUser = { uid: '123' };

describe('WalletDashboard', () => {
  // Clear mocks after each test to ensure isolation
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    useAuth.mockReturnValue({ user: mockUser });
    // Provide a mock implementation for onSnapshot that does nothing, keeping it in loading state
    onSnapshot.mockImplementation(() => () => {}); // Returns a mock unsubscribe function
    render(<WalletDashboard />);
    expect(screen.getByText('Loading wallet data...')).toBeInTheDocument();
  });

  it('renders not authenticated message if user is not logged in', () => {
    useAuth.mockReturnValue({ user: null });
    render(<WalletDashboard />);
    expect(screen.getByText('Please log in to view your wallet.')).toBeInTheDocument();
  });

  it('renders error message on failure to fetch wallet', async () => {
    // Suppress console.error for this specific test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    useAuth.mockReturnValue({ user: mockUser });
    // First call (wallet) fails, second call (transactions) succeeds with no data
    onSnapshot
      .mockImplementationOnce((ref, successCallback, errorCallback) => {
        errorCallback(new Error('Failed to load'));
        return () => {}; // unsubscribe
      })
      .mockImplementationOnce((ref, successCallback) => {
        successCallback({ forEach: () => {} });
        return () => {}; // unsubscribe
      });

    render(<WalletDashboard />);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to load wallet data.')).toBeInTheDocument();
    });

    // Restore original console.error function
    consoleErrorSpy.mockRestore();
  });

  it('renders wallet and transaction data successfully', async () => {
    useAuth.mockReturnValue({ user: mockUser });
    const mockWallet = { balance: 1234.56, currency: 'USD' };
    const mockTransactions = [
      { id: '1', description: 'Test Debit', amount: 50, currency: 'USD', type: 'debit', timestamp: { toDate: () => new Date() } },
      { id: '2', description: 'Test Credit', amount: 200, currency: 'USD', type: 'credit', timestamp: { toDate: () => new Date() } },
    ];

    // First call (wallet) succeeds with data, second call (transactions) also succeeds with data
    onSnapshot
      .mockImplementationOnce((ref, successCallback) => {
        successCallback({ exists: () => true, data: () => mockWallet });
        return () => {}; // unsubscribe
      })
      .mockImplementationOnce((ref, successCallback) => {
        const mockSnapshot = {
          forEach: (cb) => mockTransactions.forEach(tx => cb({ id: tx.id, data: () => tx })),
        };
        successCallback(mockSnapshot);
        return () => {}; // unsubscribe
      });

    render(<WalletDashboard />);

    // Wait for the component to render the data
    await waitFor(() => {
      // Corrected assertion: 1234.56 does not round up with toFixed(2)
      expect(screen.getByText('Balance: USD 1234.56')).toBeInTheDocument();
      expect(screen.getByText('Test Debit')).toBeInTheDocument();
      expect(screen.getByText('-50.00 USD')).toBeInTheDocument();
      expect(screen.getByText('Test Credit')).toBeInTheDocument();
      expect(screen.getByText('+200.00 USD')).toBeInTheDocument();
    });
  });

  it('renders "no wallet" message when wallet does not exist', async () => {
    useAuth.mockReturnValue({ user: mockUser });

    // First call (wallet) returns a non-existent doc, second call (transactions) returns no data
    onSnapshot
      .mockImplementationOnce((ref, successCallback) => {
        successCallback({ exists: () => false }); // Simulate non-existent wallet
        return () => {}; // unsubscribe
      })
      .mockImplementationOnce((ref, successCallback) => {
        successCallback({ forEach: () => {} }); // No transactions
        return () => {}; // unsubscribe
      });

    render(<WalletDashboard />);

    // The component sets an error state in this case
    await waitFor(() => {
        expect(screen.getByText('Error: Wallet not found.')).toBeInTheDocument();
    });
  });

  it('renders "no transactions" message when there are no transactions', async () => {
    useAuth.mockReturnValue({ user: mockUser });
    const mockWallet = { balance: 1234.56, currency: 'USD' };

    // First call (wallet) succeeds, second call (transactions) returns no data
    onSnapshot
      .mockImplementationOnce((ref, successCallback) => {
        successCallback({ exists: () => true, data: () => mockWallet });
        return () => {}; // unsubscribe
      })
      .mockImplementationOnce((ref, successCallback) => {
        successCallback({ forEach: () => {} }); // No transactions
        return () => {}; // unsubscribe
      });

    render(<WalletDashboard />);

    await waitFor(() => {
        expect(screen.getByText('No recent transactions.')).toBeInTheDocument();
    });
  });
});
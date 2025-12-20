import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TransactionsPage from './TransactionsPage';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Mock the useAuth hook and axios
jest.mock('../context/AuthContext');
jest.mock('axios');

const mockUser = { token: 'fake-token' };

describe('TransactionsPage', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
    axios.get.mockResolvedValue({
      data: [{ _id: '1', date: new Date(), description: 'Test', amount: 10 }],
    });
  });

  it('opens the upload modal when "Save to SwiitchSafe" is clicked', async () => {
    render(<TransactionsPage />);

    // Wait for the button to appear
    const button = await screen.findByRole('button', { name: /save to swiitchsafe/i });
    fireEvent.click(button);

    // Check that the modal title is now visible
    expect(screen.getByText('Upload Document for Transaction')).toBeInTheDocument();
  });
});

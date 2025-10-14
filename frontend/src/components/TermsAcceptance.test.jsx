import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import TermsAcceptance from './TermsAcceptance';

// Mock axios
jest.mock('axios');

describe('TermsAcceptance', () => {
  const mockOnAccept = jest.fn();

  beforeEach(() => {
    mockOnAccept.mockClear();
    axios.get.mockClear();
  });

  it('shows a loading state initially', () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<TermsAcceptance onAccept={mockOnAccept} />);
    expect(screen.getByText('Loading terms and conditions...')).toBeInTheDocument();
  });

  it('shows an error message if fetching terms fails', async () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('Network Error'));
    render(<TermsAcceptance onAccept={mockOnAccept} />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load terms and conditions.')).toBeInTheDocument();
    });
    consoleErrorMock.mockRestore();
  });

  it('renders the terms and conditions when fetched successfully', async () => {
    const terms = { data: { content: '# My Terms\n\n- Be nice\n- Be helpful' } };
    axios.get.mockResolvedValueOnce(terms);

    render(<TermsAcceptance onAccept={mockOnAccept} />);

    await waitFor(() => {
      expect(screen.getByText('My Terms')).toBeInTheDocument();
      expect(screen.getByText('Be nice')).toBeInTheDocument();
    });
  });

  it('allows the user to accept the terms by clicking the checkbox', async () => {
    const terms = { data: { content: 'Some terms' } };
    axios.get.mockResolvedValueOnce(terms);

    render(<TermsAcceptance onAccept={mockOnAccept} />);

    // Wait for terms to load
    await waitFor(() => {
      expect(screen.getByText('I agree to the terms and conditions')).toBeInTheDocument();
    });

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);

    expect(checkbox.checked).toBe(true);
    expect(screen.getByText('Thank you for accepting the terms.')).toBeInTheDocument();
    expect(mockOnAccept).toHaveBeenCalledTimes(1);
  });
});

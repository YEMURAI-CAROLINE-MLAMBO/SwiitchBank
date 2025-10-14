import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIAssistant from './AIAssistant';
import { useAuth } from '../context/AuthContext';
import { db } from '../FirebaseConfig';

// Mock the AuthContext
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

let mockOnSnapshot;
let mockWhere;
let mockCollection;

// Mock Firebase
jest.mock('../FirebaseConfig', () => ({
  db: {
    collection: (...args) => mockCollection(...args),
  },
}));

// Mock fetch
global.fetch = jest.fn();

describe('AIAssistant', () => {
  const mockUser = { uid: 'testUserId' };

  beforeEach(() => {
    // Reset mocks before each test
    useAuth.mockReturnValue({ user: mockUser });
    fetch.mockClear();

    // Re-initialize mocks for each test to ensure isolation
    mockOnSnapshot = jest.fn(() => () => {});
    mockWhere = jest.fn(() => ({ onSnapshot: mockOnSnapshot }));
    mockCollection = jest.fn(() => ({ where: mockWhere }));
  });

  it('renders the component and displays the title', () => {
    render(<AIAssistant />);
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Ask me anything about SwiitchBank!')).toBeInTheDocument();
  });

  it('allows the user to type a question', () => {
    render(<AIAssistant />);
    const input = screen.getByLabelText('Your question');
    fireEvent.change(input, { target: { value: 'How do I check my balance?' } });
    expect(input.value).toBe('How do I check my balance?');
  });

  it('submits a general question and displays the AI response', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'You can check your balance on the main dashboard.' }),
    });

    render(<AIAssistant />);

    const input = screen.getByLabelText('Your question');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    fireEvent.change(input, { target: { value: 'How do I check my balance?' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('Thinking...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Answer:')).toBeInTheDocument();
    });

    expect(screen.getByText('You can check your balance on the main dashboard.')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('/api/ai/ask', expect.any(Object));
  });

  it('submits a transaction-related question and displays the analysis', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ analysis: 'Your transactions show heavy spending on dining.' }),
    });

    render(<AIAssistant />);

    const input = screen.getByLabelText('Your question');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    fireEvent.change(input, { target: { value: 'Analyze my transactions' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('Thinking...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Answer:')).toBeInTheDocument();
    });

    expect(screen.getByText('Your transactions show heavy spending on dining.')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith('/api/transaction-analysis/analyze', expect.any(Object));
  });

  it('displays an error message if the API call fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<AIAssistant />);

    const input = screen.getByLabelText('Your question');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    fireEvent.change(input, { target: { value: 'This will fail' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to get AI response')).toBeInTheDocument();
    });
  });
});

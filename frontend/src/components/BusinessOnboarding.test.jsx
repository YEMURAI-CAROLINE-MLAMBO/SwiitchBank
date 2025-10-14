import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BusinessOnboarding from './BusinessOnboarding';

// Mock fetch
global.fetch = jest.fn();

describe('BusinessOnboarding', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Provide a default mock for fetch to avoid console errors in tests that trigger it
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ isAvailable: true }),
    });
  });

  it('renders the component and displays the title', () => {
    render(<BusinessOnboarding />);
    expect(screen.getByText('Create a Business Account')).toBeInTheDocument();
  });

  it('allows the user to fill out the form', async () => {
    render(<BusinessOnboarding />);

    // Wrap state update in waitFor to handle async nature of checkNameAvailability
    await waitFor(() => {
      fireEvent.change(screen.getByPlaceholderText('Business Name'), { target: { value: 'TestCorp' } });
    });
    fireEvent.change(screen.getByPlaceholderText('Business Address'), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByPlaceholderText('Tax ID'), { target: { value: '123456789' } });

    expect(screen.getByPlaceholderText('Business Name').value).toBe('TestCorp');
    expect(screen.getByPlaceholderText('Business Address').value).toBe('123 Test St');
    expect(screen.getByPlaceholderText('Tax ID').value).toBe('123456789');
  });

  it('checks for business name availability and shows an error if not available', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isAvailable: false }),
    });

    render(<BusinessOnboarding />);

    const nameInput = screen.getByPlaceholderText('Business Name');
    fireEvent.change(nameInput, { target: { value: 'TakenCorp' } });

    await waitFor(() => {
      expect(screen.getByText('Business name not available')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith('/api/onboarding/business/availability?businessName=TakenCorp');
  });

  it('submits the form successfully when the name is available', async () => {
    // Mock the availability check
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isAvailable: true }),
    });

    // Mock the form submission
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Business account created successfully!' }),
    });

    // Mock the alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<BusinessOnboarding />);

    fireEvent.change(screen.getByPlaceholderText('Business Name'), { target: { value: 'AvailableCorp' } });
    fireEvent.change(screen.getByPlaceholderText('Business Address'), { target: { value: '456 Available Ave' } });
    fireEvent.change(screen.getByPlaceholderText('Tax ID'), { target: { value: '987654321' } });

    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/onboarding/business', expect.any(Object));
    });

    expect(alertMock).toHaveBeenCalledWith('Business account created successfully!');
    alertMock.mockRestore();
  });

  it('shows an alert if the user tries to submit with an unavailable name', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isAvailable: false }),
    });

    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<BusinessOnboarding />);

    const nameInput = screen.getByPlaceholderText('Business Name');
    fireEvent.change(nameInput, { target: { value: 'TakenCorp' } });

    // Wait for the availability check to complete and the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Business name not available')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    expect(alertMock).toHaveBeenCalledWith('Business name is not available. Please choose another one.');
    alertMock.mockRestore();
  });
});

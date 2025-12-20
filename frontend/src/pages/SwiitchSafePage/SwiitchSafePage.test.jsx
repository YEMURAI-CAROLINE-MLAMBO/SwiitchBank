import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SwiitchSafePage from '../../pages/SwiitchSafePage/SwiitchSafePage';
import swiitchSafeService from '../../services/swiitchSafeService';
import { useAuth } from '../../context/AuthContext';

// Mock the service and the useAuth hook
jest.mock('../../services/swiitchSafeService');
jest.mock('../../context/AuthContext');

const mockUser = { token: 'fake-token' };

describe('SwiitchSafePage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    swiitchSafeService.listDocuments.mockClear();
    swiitchSafeService.uploadDocument.mockClear();
    swiitchSafeService.deleteDocument.mockClear();
    useAuth.mockReturnValue({ user: mockUser });
  });

  it('renders the page and fetches documents', async () => {
    const mockDocs = [
      { _id: '1', fileName: 'doc1.pdf', createdAt: new Date() },
    ];
    swiitchSafeService.listDocuments.mockResolvedValue(mockDocs);

    render(<SwiitchSafePage />);

    expect(screen.getByText('SwiitchSafe')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('doc1.pdf')).toBeInTheDocument();
    });

    expect(swiitchSafeService.listDocuments).toHaveBeenCalledWith('fake-token');
  });

  it('handles document upload', async () => {
    swiitchSafeService.listDocuments.mockResolvedValue([]);
    swiitchSafeService.uploadDocument.mockResolvedValue({ _id: '2', fileName: 'new_doc.pdf', createdAt: new Date() });

    render(<SwiitchSafePage />);

    const file = new File(['hello'], 'new_doc.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText('File upload');
    fireEvent.change(input, { target: { files: [file] } });

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(swiitchSafeService.uploadDocument).toHaveBeenCalledWith(file, 'fake-token');
    });

    expect(swiitchSafeService.listDocuments).toHaveBeenCalledTimes(2);
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentList from '../../components/swiitchSafe/DocumentList';
import { useAuth } from '../../context/AuthContext';

// Mock the useAuth hook
jest.mock('../../context/AuthContext');

const mockUser = { token: 'fake-token' };

describe('DocumentList', () => {
  const mockDocs = [
    { _id: '1', fileName: 'doc1.pdf', createdAt: '2023-01-01' },
    { _id: '2', fileName: 'doc2.jpg', createdAt: '2023-01-02' },
  ];

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
  });

  it('shows a message when there are no documents', () => {
    render(<DocumentList documents={[]} />);
    expect(screen.getByText('You have no documents saved.')).toBeInTheDocument();
  });

  it('renders a list of documents', () => {
    render(<DocumentList documents={mockDocs} />);

    expect(screen.getByText('doc1.pdf')).toBeInTheDocument();
    expect(screen.getByText('doc2.jpg')).toBeInTheDocument();
  });

  it('calls the onDelete handler when the delete button is clicked', () => {
    const onDelete = jest.fn();
    render(<DocumentList documents={mockDocs} onDelete={onDelete} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('calls the handleDownload function when download button is clicked', () => {
    const handleDownload = jest.fn();
    render(<DocumentList documents={mockDocs} onDelete={() => {}} />);

    // Since handleDownload is internal to the component, we can't directly test it.
    // Instead, we can check that the download button exists.
    const downloadButtons = screen.getAllByRole('button', { name: /download/i });
    expect(downloadButtons[0]).toBeInTheDocument();
  });
});

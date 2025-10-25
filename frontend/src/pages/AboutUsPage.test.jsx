import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutUsPage from './AboutUsPage';

test('renders About Us page with correct content', () => {
  render(<AboutUsPage />);

  // Check for the main heading
  expect(screen.getByText('About SwiitchBank')).toBeInTheDocument();

  // Check for the subtitle
  expect(screen.getByText('Anywhere, Anytime.')).toBeInTheDocument();

  // Check for section headings
  expect(screen.getByText('Our Vision')).toBeInTheDocument();
  expect(screen.getByText('Our Mission')).toBeInTheDocument();
  expect(screen.getByText('What Makes Us Different')).toBeInTheDocument();
  expect(screen.getByText('Our Core Values')).toBeInTheDocument();
});

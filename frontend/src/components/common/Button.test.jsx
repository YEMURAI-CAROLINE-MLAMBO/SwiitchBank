import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

describe('Button', () => {
  test('should have type "button" by default', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    // This will fail initially, but succeed after the component is fixed.
    expect(buttonElement).toHaveAttribute('type', 'button');
  });

  test('should override the default type when a type prop is provided', () => {
    render(<Button type="submit">Submit</Button>);
    const buttonElement = screen.getByRole('button', { name: /submit/i });
    expect(buttonElement).toHaveAttribute('type', 'submit');
  });

  test('should pass other props to the button element', () => {
    render(<Button className="custom-class">Custom</Button>);
    const buttonElement = screen.getByRole('button', { name: /custom/i });
    expect(buttonElement).toHaveClass('custom-class');
  });
});
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Moringa Lost & Found brand', () => {
  render(<App />);
  const brandElements = screen.getAllByText(/moringa lost & found/i);
  expect(brandElements.length).toBeGreaterThan(0);
});

test('renders hero title', () => {
  render(<App />);
  const heroTitle = screen.getByText(/find what you've lost/i);
  expect(heroTitle).toBeInTheDocument();
});

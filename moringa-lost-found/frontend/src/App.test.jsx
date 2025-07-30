import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Moringa Lost & Found brand', () => {
  render(<App />);
  const brandElement = screen.getByText(/moringa lost & found/i);
  expect(brandElement).toBeInTheDocument();
});

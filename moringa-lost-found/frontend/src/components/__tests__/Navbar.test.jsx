import { render, screen } from '@testing-library/react';
import Navbar from '../Navbar';

describe('Navbar Component', () => {
  test('renders brand name', () => {
    render(<Navbar />);
    const brandElement = screen.getByText(/moringa lost & found/i);
    expect(brandElement).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/report item/i)).toBeInTheDocument();
    expect(screen.getByText(/search/i)).toBeInTheDocument();
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
  });
});

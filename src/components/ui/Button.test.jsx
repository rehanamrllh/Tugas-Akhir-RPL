import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders correctly with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(<Button>Default</Button>);
    const button = screen.getByText('Default');
    expect(button).toHaveClass('ui-btn');
    expect(button).toHaveClass('ui-btn-primary');
    expect(button).toHaveClass('ui-btn-md');
  });

  it('applies custom variant and size classes', () => {
    render(<Button variant="danger" size="lg">Danger Large</Button>);
    const button = screen.getByText('Danger Large');
    expect(button).toHaveClass('ui-btn-danger');
    expect(button).toHaveClass('ui-btn-lg');
  });

  it('renders an icon if provided', () => {
    render(<Button icon="fas fa-check">With Icon</Button>);
    // Since icon is an <i> element inside button
    const button = screen.getByText('With Icon');
    const icon = button.querySelector('i');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('fas', 'fa-check');
  });

  it('handles onClick events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

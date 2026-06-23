import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from './Badge';

describe('Badge Component', () => {
  it('renders correctly with children', () => {
    render(<Badge>New Item</Badge>);
    expect(screen.getByText('New Item')).toBeInTheDocument();
  });

  it('renders as a span by default', () => {
    const { container } = render(<Badge>Span Text</Badge>);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('renders as a different element when "as" prop is provided', () => {
    const { container } = render(<Badge as="div">Div Text</Badge>);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toHaveClass('ui-badge');
    expect(badge).toHaveClass('ui-badge-primary');
    expect(badge).not.toHaveClass('active');
  });

  it('applies custom variant and active classes', () => {
    render(<Badge variant="secondary" active>Active Badge</Badge>);
    const badge = screen.getByText('Active Badge');
    expect(badge).toHaveClass('ui-badge-secondary');
    expect(badge).toHaveClass('active');
  });
});

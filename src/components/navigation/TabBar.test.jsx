import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TabBar from './TabBar';

// Framer Motion's layoutId animations require a DOM that supports layout —
// stub out the animated span so tests focus on behavior, not animation.
vi.mock('framer-motion', () => ({
  motion: {
    span: ({ children, ...props }) => {
      // Strip Framer-specific props before passing to the real span
      const { layoutId, initial, transition, ...rest } = props;
      return <span {...rest}>{children}</span>;
    },
  },
}));

const TABS = ['Stocks', 'ETFs', 'Mutual Funds'];

describe('TabBar', () => {
  it('renders all tab labels', () => {
    render(<TabBar tabs={TABS} activeTab="Stocks" onChange={() => {}} />);
    TABS.forEach((tab) => {
      expect(screen.getByRole('tab', { name: tab })).toBeInTheDocument();
    });
  });

  it('marks the active tab as selected', () => {
    render(<TabBar tabs={TABS} activeTab="ETFs" onChange={() => {}} />);
    expect(screen.getByRole('tab', { name: 'ETFs' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tab', { name: 'Stocks' })).toHaveAttribute(
      'aria-selected',
      'false'
    );
    expect(screen.getByRole('tab', { name: 'Mutual Funds' })).toHaveAttribute(
      'aria-selected',
      'false'
    );
  });

  it('calls onChange with the clicked tab label', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<TabBar tabs={TABS} activeTab="Stocks" onChange={handleChange} />);
    await user.click(screen.getByRole('tab', { name: 'ETFs' }));

    expect(handleChange).toHaveBeenCalledOnce();
    expect(handleChange).toHaveBeenCalledWith('ETFs');
  });

  it('does not call onChange when clicking the already-active tab', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<TabBar tabs={TABS} activeTab="Stocks" onChange={handleChange} />);
    await user.click(screen.getByRole('tab', { name: 'Stocks' }));

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders a nav element with an accessible label', () => {
    render(<TabBar tabs={TABS} activeTab="Stocks" onChange={() => {}} />);
    expect(screen.getByRole('navigation', { name: 'Asset type tabs' })).toBeInTheDocument();
  });

  it('renders an empty state without crashing when no tabs are provided', () => {
    render(<TabBar tabs={[]} activeTab="" onChange={() => {}} />);
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
  });

  it('applies active color class only to the active tab', () => {
    render(<TabBar tabs={TABS} activeTab="Mutual Funds" onChange={() => {}} />);

    const activeTab = screen.getByRole('tab', { name: 'Mutual Funds' });
    const inactiveTab = screen.getByRole('tab', { name: 'Stocks' });

    expect(activeTab.className).toContain('text-emerald');
    expect(inactiveTab.className).not.toContain('text-emerald');
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BottomNav from './BottomNav';

// Stub Framer Motion to avoid layout animation issues in jsdom.
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, whileTap, transition, ...props }) => (
      <button {...props}>{children}</button>
    ),
    span: ({ children, layoutId, initial, animate, transition, ...props }) => (
      <span {...props}>{children}</span>
    ),
  },
}));

// Helper: render BottomNav inside a MemoryRouter at the given path.
function renderAt(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <BottomNav />
    </MemoryRouter>
  );
}

const TAB_LABELS = ['Dashboard', 'Analytics', 'Assets', 'Settings'];

describe('BottomNav', () => {
  it('renders all four tab buttons', () => {
    renderAt('/');
    TAB_LABELS.forEach((label) => {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    });
  });

  it('renders a <nav> with an accessible label', () => {
    renderAt('/');
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });

  it('each tab button has an aria-label matching its label', () => {
    renderAt('/');
    TAB_LABELS.forEach((label) => {
      const btn = screen.getByRole('button', { name: label });
      expect(btn).toHaveAttribute('aria-label', label);
    });
  });

  describe('active tab detection', () => {
    it('marks Dashboard as active on "/"', () => {
      renderAt('/');
      const dashBtn = screen.getByRole('button', { name: 'Dashboard' });
      expect(dashBtn).toHaveAttribute('aria-current', 'page');
      // Inactive tabs must NOT have aria-current
      ['Analytics', 'Assets', 'Settings'].forEach((label) => {
        expect(screen.getByRole('button', { name: label })).not.toHaveAttribute(
          'aria-current',
          'page'
        );
      });
    });

    it('marks Analytics as active on "/analytics"', () => {
      renderAt('/analytics');
      expect(screen.getByRole('button', { name: 'Analytics' })).toHaveAttribute(
        'aria-current',
        'page'
      );
      expect(screen.getByRole('button', { name: 'Dashboard' })).not.toHaveAttribute(
        'aria-current',
        'page'
      );
    });

    it('marks Assets as active on "/portfolio"', () => {
      renderAt('/portfolio');
      expect(screen.getByRole('button', { name: 'Assets' })).toHaveAttribute(
        'aria-current',
        'page'
      );
    });

    it('marks Settings as active on "/settings"', () => {
      renderAt('/settings');
      expect(screen.getByRole('button', { name: 'Settings' })).toHaveAttribute(
        'aria-current',
        'page'
      );
    });

    it('Dashboard is NOT active on "/analytics" (exact match guard)', () => {
      renderAt('/analytics');
      expect(screen.getByRole('button', { name: 'Dashboard' })).not.toHaveAttribute(
        'aria-current',
        'page'
      );
    });
  });

  describe('active tab color class', () => {
    it('applies the emerald color class only to the active tab', () => {
      renderAt('/');
      const activeBtn = screen.getByRole('button', { name: 'Dashboard' });
      const inactiveBtn = screen.getByRole('button', { name: 'Analytics' });

      expect(activeBtn.className).toContain('text-emerald');
      expect(inactiveBtn.className).not.toContain('text-emerald');
    });
  });

  describe('navigation behaviour', () => {
    it('navigates to "/" when the Dashboard tab is clicked', async () => {
      const user = userEvent.setup();
      renderAt('/analytics');

      await user.click(screen.getByRole('button', { name: 'Dashboard' }));

      // After clicking Dashboard the tab should become active
      expect(screen.getByRole('button', { name: 'Dashboard' })).toHaveAttribute(
        'aria-current',
        'page'
      );
    });
  });

  describe('safe-area and positioning', () => {
    it('renders the nav with the safe-area-inset-bottom inline style', () => {
      renderAt('/');
      const nav = screen.getByRole('navigation', { name: 'Main navigation' });
      // jsdom strips env() values when React sets them via element.style —
      // verify intent via the data attribute set on the nav element.
      expect(nav).toHaveAttribute('data-safe-area-bottom', 'true');
    });

    it('applies the fixed and z-50 positioning classes', () => {
      renderAt('/');
      const nav = screen.getByRole('navigation', { name: 'Main navigation' });
      expect(nav.className).toContain('fixed');
      expect(nav.className).toContain('z-50');
    });
  });
});

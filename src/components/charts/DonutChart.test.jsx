/**
 * Tests for DonutChart component.
 * Validates Requirements 3.3, 6.1
 */

import { render, screen } from '@testing-library/react';
import DonutChart from './DonutChart';

// Recharts renders SVG in jsdom; ResizeObserver is mocked in setup.js.

const SAMPLE_DATA = [
  { name: 'Stocks', value: 50, color: '#10B981' },
  { name: 'ETFs', value: 30, color: '#3B82F6' },
  { name: 'Mutual Funds', value: 20, color: '#F59E0B' },
];

const SINGLE_SLICE = [
  { name: 'Stocks', value: 100, color: '#10B981' },
];

describe('DonutChart', () => {
  // ── Loading state ──────────────────────────────────────────────────────────

  it('renders a skeleton when loading is true', () => {
    render(<DonutChart data={SAMPLE_DATA} loading />);
    const skeleton = screen.getByLabelText('Loading chart…');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
  });

  it('does not render the chart when loading is true', () => {
    render(<DonutChart data={SAMPLE_DATA} loading />);
    expect(screen.queryByLabelText('Asset allocation donut chart')).not.toBeInTheDocument();
  });

  // ── Empty state ────────────────────────────────────────────────────────────

  it('renders an empty-state message when data is an empty array', () => {
    render(<DonutChart data={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders an empty-state message when data prop is omitted', () => {
    render(<DonutChart />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  // ── Chart rendering ────────────────────────────────────────────────────────

  it('renders the chart wrapper with the correct aria-label', () => {
    render(<DonutChart data={SAMPLE_DATA} />);
    expect(screen.getByLabelText('Asset allocation donut chart')).toBeInTheDocument();
  });

  it('renders a recharts responsive container for non-empty data', () => {
    const { container } = render(<DonutChart data={SAMPLE_DATA} />);
    const chartWrapper = container.querySelector('.recharts-responsive-container');
    expect(chartWrapper).not.toBeNull();
  });

  it('renders with a single data slice', () => {
    const { container } = render(<DonutChart data={SINGLE_SLICE} />);
    const chartWrapper = container.querySelector('.recharts-responsive-container');
    expect(chartWrapper).not.toBeNull();
  });

  // ── Legend ─────────────────────────────────────────────────────────────────

  it('renders legend entries for each data item', () => {
    render(<DonutChart data={SAMPLE_DATA} />);
    expect(screen.getByText('Stocks')).toBeInTheDocument();
    expect(screen.getByText('ETFs')).toBeInTheDocument();
    expect(screen.getByText('Mutual Funds')).toBeInTheDocument();
  });

  it('renders a legend container with aria-label "Chart legend"', () => {
    render(<DonutChart data={SAMPLE_DATA} />);
    expect(screen.getByLabelText('Chart legend')).toBeInTheDocument();
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  it('loading skeleton has aria-busy=true', () => {
    render(<DonutChart loading />);
    expect(screen.getByLabelText('Loading chart…')).toHaveAttribute('aria-busy', 'true');
  });

  it('empty-state container has the correct aria-label', () => {
    render(<DonutChart data={[]} />);
    expect(screen.getByLabelText('No data available')).toBeInTheDocument();
  });
});

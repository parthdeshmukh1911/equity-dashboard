/**
 * Tests for StackedBar component.
 * Validates Requirement 6.6: Portfolio Composition Stacked Bar Chart.
 */

import { render, screen } from '@testing-library/react';
import StackedBar from './StackedBar';

// Recharts uses SVG internally; jsdom doesn't fully support SVG but renders enough
// for attribute and text-based assertions. ResizeObserver is mocked in setup.js.

const SAMPLE_DATA = [
  { label: 'Portfolio', stocks: 50, etfs: 30, mf: 20 },
];

const MULTI_DATA = [
  { label: 'Q1', stocks: 40, etfs: 35, mf: 25 },
  { label: 'Q2', stocks: 45, etfs: 30, mf: 25 },
  { label: 'Q3', stocks: 55, etfs: 25, mf: 20 },
];

describe('StackedBar', () => {
  // ── Loading state ──────────────────────────────────────────────────────────

  it('renders a skeleton when loading is true', () => {
    render(<StackedBar data={SAMPLE_DATA} loading />);
    // Skeleton uses aria-label="Loading…" or aria-busy="true"
    const skeleton = screen.getByLabelText('Loading chart…');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
  });

  it('does not render the chart container when loading is true', () => {
    render(<StackedBar data={SAMPLE_DATA} loading />);
    expect(screen.queryByLabelText('Portfolio composition stacked bar chart')).not.toBeInTheDocument();
  });

  // ── Empty state ────────────────────────────────────────────────────────────

  it('renders an empty-state message when data is an empty array', () => {
    render(<StackedBar data={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('renders an empty-state message when data prop is omitted (defaults to [])', () => {
    render(<StackedBar />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  // ── Chart rendering ────────────────────────────────────────────────────────

  it('renders the chart wrapper with the correct aria-label', () => {
    render(<StackedBar data={SAMPLE_DATA} />);
    expect(
      screen.getByLabelText('Portfolio composition stacked bar chart')
    ).toBeInTheDocument();
  });

  it('renders the recharts responsive container for non-empty data', () => {
    const { container } = render(<StackedBar data={SAMPLE_DATA} />);
    // ResponsiveContainer renders a div wrapper in jsdom (SVG needs real dimensions)
    const chartWrapper = container.querySelector('.recharts-responsive-container');
    expect(chartWrapper).not.toBeNull();
  });

  it('renders the recharts responsive container for multi-item data', () => {
    const { container } = render(<StackedBar data={MULTI_DATA} />);
    const chartWrapper = container.querySelector('.recharts-responsive-container');
    expect(chartWrapper).not.toBeNull();
  });

  // ── Legend ─────────────────────────────────────────────────────────────────

  it('renders the legend with Stocks label', () => {
    render(<StackedBar data={SAMPLE_DATA} />);
    expect(screen.getByText('Stocks')).toBeInTheDocument();
  });

  it('renders the legend with ETFs label', () => {
    render(<StackedBar data={SAMPLE_DATA} />);
    expect(screen.getByText('ETFs')).toBeInTheDocument();
  });

  it('renders the legend with Mutual Funds label', () => {
    render(<StackedBar data={SAMPLE_DATA} />);
    expect(screen.getByText('Mutual Funds')).toBeInTheDocument();
  });

  it('renders a legend container with aria-label "Chart legend"', () => {
    render(<StackedBar data={SAMPLE_DATA} />);
    expect(screen.getByLabelText('Chart legend')).toBeInTheDocument();
  });

  // ── Accessibility ──────────────────────────────────────────────────────────

  it('renders loading state with aria-busy=true', () => {
    render(<StackedBar data={SAMPLE_DATA} loading />);
    const loadingEl = screen.getByLabelText('Loading chart…');
    expect(loadingEl).toHaveAttribute('aria-busy', 'true');
  });

  it('empty-state container has the correct aria-label', () => {
    render(<StackedBar data={[]} />);
    expect(screen.getByLabelText('No data available')).toBeInTheDocument();
  });
});

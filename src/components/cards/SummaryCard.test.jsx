import { render, screen } from '@testing-library/react';
import SummaryCard from './SummaryCard';

describe('SummaryCard', () => {
  const baseProps = {
    assetType: 'Stocks',
    currentValue: 382000,
    investedValue: 325000,
    returnValue: 57000,
    returnPct: 17.54,
    weight: 65,
  };

  it('renders the asset type name', () => {
    render(<SummaryCard {...baseProps} />);
    expect(screen.getByText('Stocks')).toBeInTheDocument();
  });

  it('renders the current value formatted as currency', () => {
    render(<SummaryCard {...baseProps} />);
    // 382000 → ₹3.82L
    expect(screen.getByText('₹3.82L')).toBeInTheDocument();
  });

  it('renders the invested value with label', () => {
    render(<SummaryCard {...baseProps} />);
    expect(screen.getByText(/Invested:/)).toBeInTheDocument();
    expect(screen.getByText(/₹3.25L/)).toBeInTheDocument();
  });

  it('renders the portfolio weight percentage', () => {
    render(<SummaryCard {...baseProps} />);
    expect(screen.getByText('65.0%')).toBeInTheDocument();
  });

  it('renders the return percentage', () => {
    render(<SummaryCard {...baseProps} />);
    expect(screen.getByText('+17.54%')).toBeInTheDocument();
  });

  it('applies profit color for positive returns', () => {
    render(<SummaryCard {...baseProps} />);
    // Both return value and return % elements should have green color
    const returnPctEl = screen.getByText('+17.54%');
    expect(returnPctEl).toHaveStyle({ color: '#22C55E' });
  });

  it('applies loss color for negative returns', () => {
    render(
      <SummaryCard
        {...baseProps}
        returnValue={-12000}
        returnPct={-3.69}
      />
    );
    const returnPctEl = screen.getByText('−3.69%');
    expect(returnPctEl).toHaveStyle({ color: '#EF4444' });
  });

  it('renders ETFs with correct asset type label', () => {
    render(
      <SummaryCard
        assetType="ETFs"
        currentValue={117500}
        investedValue={100000}
        returnValue={17500}
        returnPct={17.5}
        weight={20}
      />
    );
    expect(screen.getByText('ETFs')).toBeInTheDocument();
  });

  it('renders Mutual Funds label', () => {
    render(
      <SummaryCard
        assetType="Mutual Funds"
        currentValue={70500}
        investedValue={60000}
        returnValue={10500}
        returnPct={17.5}
        weight={12}
      />
    );
    expect(screen.getByText('Mutual Funds')).toBeInTheDocument();
  });

  it('has an accessible aria-label summarising asset type and return', () => {
    render(<SummaryCard {...baseProps} />);
    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('aria-label', expect.stringContaining('Stocks'));
    expect(card).toHaveAttribute('aria-label', expect.stringContaining('₹3.82L'));
  });

  it('renders zero return without profit or loss color ambiguity', () => {
    render(
      <SummaryCard
        {...baseProps}
        returnValue={0}
        returnPct={0}
      />
    );
    // 0 is treated as non-negative → profit color
    const returnPctEl = screen.getByText('0.00%');
    expect(returnPctEl).toHaveStyle({ color: '#22C55E' });
  });
});

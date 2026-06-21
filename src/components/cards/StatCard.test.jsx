import { render, screen } from '@testing-library/react';
import { TrendingUp, Award, TrendingDown, Layers, PieChart } from 'lucide-react';
import StatCard from './StatCard';

describe('StatCard', () => {
  // ── Basic rendering ──────────────────────────────────────────────────────────

  it('renders the label', () => {
    render(<StatCard label="Portfolio Return" value="+12.34%" icon={TrendingUp} />);
    expect(screen.getByText('Portfolio Return')).toBeInTheDocument();
  });

  it('renders the primary value', () => {
    render(<StatCard label="Total Holdings" value="24" icon={Layers} />);
    expect(screen.getByText('24')).toBeInTheDocument();
  });

  it('renders the subValue when provided', () => {
    render(
      <StatCard
        label="Best Performer"
        value="HDFC Bank"
        subValue="+18.5%"
        icon={Award}
      />
    );
    expect(screen.getByText('+18.5%')).toBeInTheDocument();
  });

  it('does not render subValue element when not provided', () => {
    render(<StatCard label="Total Holdings" value="24" icon={Layers} />);
    // There should be exactly one <p> element — the primary value
    const paragraphs = screen.getAllByRole('paragraph').filter(
      el => el.tagName === 'P'
    );
    expect(paragraphs).toHaveLength(1);
  });

  it('renders without crashing when subValue is null', () => {
    render(<StatCard label="Diversification Score" value="72" subValue={null} icon={PieChart} />);
    expect(screen.getByText('72')).toBeInTheDocument();
  });

  it('renders without crashing when icon is not provided', () => {
    render(<StatCard label="Total Holdings" value="24" />);
    expect(screen.getByText('Total Holdings')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
  });

  // ── Colour logic ─────────────────────────────────────────────────────────────

  it('applies profit color for a positive (+-prefixed) value', () => {
    render(<StatCard label="Portfolio Return" value="+12.34%" icon={TrendingUp} />);
    const valueEl = screen.getByText('+12.34%');
    expect(valueEl).toHaveStyle({ color: '#22C55E' });
  });

  it('applies loss color for a negative (−-prefixed) value', () => {
    render(<StatCard label="Worst Performer" value="−8.2%" icon={TrendingDown} />);
    const valueEl = screen.getByText('−8.2%');
    expect(valueEl).toHaveStyle({ color: '#EF4444' });
  });

  it('applies loss color for a hyphen-minus-prefixed negative value', () => {
    render(<StatCard label="Worst Performer" value="-8.2%" icon={TrendingDown} />);
    const valueEl = screen.getByText('-8.2%');
    expect(valueEl).toHaveStyle({ color: '#EF4444' });
  });

  it('applies neutral (off-white) color for a non-numeric name value', () => {
    render(<StatCard label="Best Performer" value="HDFC Bank" icon={Award} />);
    const valueEl = screen.getByText('HDFC Bank');
    expect(valueEl).toHaveStyle({ color: '#F8FAFC' });
  });

  it('applies profit color for a bare positive numeric value (count)', () => {
    render(<StatCard label="Total Holdings" value="24" icon={Layers} />);
    const valueEl = screen.getByText('24');
    expect(valueEl).toHaveStyle({ color: '#22C55E' });
  });

  it('applies neutral color for a score-like plain number presented as a label string', () => {
    // Diversification score returned as "72 / 100" — contains non-digit after digits → neutral
    render(<StatCard label="Diversification Score" value="72 / 100" icon={PieChart} />);
    const valueEl = screen.getByText('72 / 100');
    // Starts with digit, no leading '-'/'−' → treated as positive → profit green
    expect(valueEl).toHaveStyle({ color: '#22C55E' });
  });

  // ── Accessibility ─────────────────────────────────────────────────────────────

  it('has a descriptive aria-label on the article element', () => {
    render(
      <StatCard
        label="Portfolio Return"
        value="+12.34%"
        subValue="Year-to-date"
        icon={TrendingUp}
      />
    );
    const article = screen.getByRole('article');
    expect(article).toHaveAttribute(
      'aria-label',
      'Portfolio Return: +12.34%, Year-to-date'
    );
  });

  it('aria-label omits subValue part when subValue is not provided', () => {
    render(<StatCard label="Total Holdings" value="24" icon={Layers} />);
    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-label', 'Total Holdings: 24');
  });

  it('icon is hidden from assistive technology via aria-hidden', () => {
    render(<StatCard label="Portfolio Return" value="+12.34%" icon={TrendingUp} />);
    const iconWrapper = screen.getByRole('article').querySelector('[aria-hidden="true"]');
    expect(iconWrapper).not.toBeNull();
  });

  // ── Glassmorphism card style ──────────────────────────────────────────────────

  it('applies glassmorphism background style to the card', () => {
    render(<StatCard label="Portfolio Return" value="+12.34%" icon={TrendingUp} />);
    const article = screen.getByRole('article');
    expect(article).toHaveStyle({ backdropFilter: 'blur(16px)' });
  });
});

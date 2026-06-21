import SectorBars from '../../components/charts/SectorBars';

/**
 * SectorAllocation — Dashboard section wrapping the animated SectorBars chart.
 *
 * Props:
 *   sectorAllocation {Array<{ sector: string, pct: number }>}
 *   loading          {boolean}  When true, renders SectorBars skeleton.
 *
 * Requirements: 3.5
 */
export default function SectorAllocation({ sectorAllocation = [], loading = false }) {
  return (
    <section aria-label="Sector Allocation">
      <h2 className="text-base font-semibold text-white mb-3">Sector Allocation</h2>
      <SectorBars data={sectorAllocation} loading={loading} />
    </section>
  );
}

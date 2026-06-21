const MARKET_TIME_ZONE = 'Asia/Kolkata';
const MARKET_OPEN_MINUTES = 9 * 60 + 15;
const MARKET_CLOSE_MINUTES = 15 * 60 + 30;
const MARKET_DAYS = new Set(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

/**
 * Returns whether the Indian equity market is within its regular trading window.
 * The explicit timezone keeps polling correct even when the device is abroad.
 */
export function isIndianMarketOpen(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: MARKET_TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);

  const values = Object.fromEntries(
    parts
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, value])
  );

  if (!MARKET_DAYS.has(values.weekday)) return false;

  const minutesSinceMidnight = Number(values.hour) * 60 + Number(values.minute);
  return (
    minutesSinceMidnight >= MARKET_OPEN_MINUTES &&
    minutesSinceMidnight < MARKET_CLOSE_MINUTES
  );
}

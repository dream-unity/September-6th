(() => {
  'use strict';

  const root = document.getElementById('unlockCountdown');
  const value = document.getElementById('countdownValue');
  if (!root || !value) return;

  // September 6, 2026 at 12:00:00 am in Honolulu / UTC-10.
  // Fixing the instant in UTC keeps the deadline identical everywhere:
  // 2026-09-06 00:00:00 UTC-10 = 2026-09-06 10:00:00 UTC.
  const unlockAt = Date.parse('2026-09-06T10:00:00.000Z');
  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  let timer = 0;

  const two = number => String(number).padStart(2, '0');

  function render() {
    const remaining = Math.max(0, unlockAt - Date.now());

    if (remaining <= 0) {
      value.textContent = 'UNLOCKED';
      root.classList.add('unlocked');
      root.setAttribute('aria-label', 'Unlocked');
      if (timer) clearTimeout(timer);
      return;
    }

    const days = Math.floor(remaining / DAY);
    const hours = Math.floor((remaining % DAY) / HOUR);
    const minutes = Math.floor((remaining % HOUR) / MINUTE);
    const seconds = Math.floor((remaining % MINUTE) / SECOND);

    value.textContent = `${two(days)}D  ${two(hours)}:${two(minutes)}:${two(seconds)}`;
    root.setAttribute(
      'aria-label',
      `Unlocked in ${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`
    );

    // Repaint just after the next whole-second boundary to prevent drift.
    const delay = Math.max(50, SECOND - (Date.now() % SECOND) + 12);
    timer = window.setTimeout(render, delay);
  }

  render();
})();

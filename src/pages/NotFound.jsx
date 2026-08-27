import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * NotFound.jsx — 404 page for TileCounter
 *
 * Usage:
 *   import NotFound from "./NotFound";
 *   <Route path="*" element={<NotFound />} />
 *
 * Self-contained: no CSS file, no Tailwind, no extra packages.
 * Only dependency is react-router-dom (for Link + useLocation).
 */

const TILE_COUNT = 160;

// Deterministic pseudo-random 0..1 per tile, so the glaze doesn't
// reshuffle on every render. Real glazed tile is never one flat colour.
const glazeSeed = (i) => {
    const n = Math.sin(i * 12.9898) * 43758.5453;
    return n - Math.floor(n);
};

export default function NotFound() {
    const { pathname } = useLocation();
    const [chipped, setChipped] = useState(() => new Set());

    const seeds = useMemo(
        () => Array.from({ length: TILE_COUNT }, (_, i) => glazeSeed(i)),
        []
    );

    const chip = (i) =>
        setChipped((prev) => {
            if (prev.has(i)) return prev;
            const next = new Set(prev);
            next.add(i);
            return next;
        });

    const broken = chipped.size;
    const pad = String(broken).padStart(2, "0");

    return (
        <div className="tc404">
            <style>{CSS}</style>

            <div className="tc404__floor" aria-hidden="true">
                {seeds.map((seed, i) => (
                    <span
                        key={i}
                        className={`tc404__tile${chipped.has(i) ? " is-chipped" : ""}`}
                        style={{
                            "--seed": seed,
                            "--delay": `${(i % 17) * 18}ms`,
                        }}
                        onMouseDown={() => chip(i)}
                    />
                ))}
            </div>

            <div className="tc404__panel" role="alert">
                <p className="tc404__eyebrow">404 · not in this batch</p>

                <h1 className="tc404__title">
                    This one didn&rsquo;t make it
                    <br />
                    off the pallet.
                </h1>

                <p className="tc404__body">
                    Nothing is laid at <code className="tc404__path">{pathname}</code>.
                    Check the address, or head back and count something that exists.
                </p>

                <div className="tc404__actions">
                    <Link className="tc404__btn tc404__btn--solid" to="/">
                        Back to the counter
                    </Link>
                    {broken > 0 && (
                        <button
                            type="button"
                            className="tc404__btn tc404__btn--ghost"
                            onClick={() => setChipped(new Set())}
                        >
                            Sweep it up
                        </button>
                    )}
                </div>

                <p className="tc404__tally" aria-live="polite">
                    {broken === 0 && (
                        <span className="tc404__hint">Tap the floor. See what happens.</span>
                    )}
                    {broken > 0 && broken < 14 && (
                        <>
                            Tiles chipped: <strong>{pad}</strong> · add {broken} to your order
                        </>
                    )}
                    {broken >= 14 && (
                        <>
                            Tiles chipped: <strong>{pad}</strong> · at this point you&rsquo;re
                            retiling the whole room
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=IBM+Plex+Mono:wght@400;600&display=swap');

.tc404 {
  --subfloor: #14171B;
  --grout:    #232830;
  --glaze:    #1B6B72;
  --chalk:    #EDE9E2;
  --ochre:    #E8A33D;

  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: clamp(1rem, 4vw, 3rem);
  background: var(--grout);
  overflow: hidden;
  isolation: isolate;
}

/* ---- the floor ---- */
.tc404__floor {
  position: absolute;
  inset: -4px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(58px, 1fr));
  grid-auto-rows: 58px;
  gap: 5px;
  z-index: 0;
}

.tc404__tile {
  background:
    linear-gradient(
      145deg,
      hsl(186 60% calc(24% + var(--seed) * 7%)),
      hsl(186 55% calc(18% + var(--seed) * 5%))
    );
  border-radius: 2px;
  box-shadow: inset 0 1px 0 hsl(186 45% 42% / 0.35);
  cursor: pointer;
  animation: tc404-settle 420ms var(--delay) both cubic-bezier(.2,.8,.3,1);
  transition: filter 140ms ease, transform 140ms ease;
}

.tc404__tile:hover { filter: brightness(1.22); }

.tc404__tile.is-chipped {
  background: var(--subfloor);
  box-shadow: inset 0 2px 6px #000, inset 0 -1px 0 hsl(186 30% 30% / 0.4);
  transform: scale(0.965);
  cursor: default;
}
.tc404__tile.is-chipped:hover { filter: none; }

@keyframes tc404-settle {
  from { opacity: 0; transform: translateY(-6px) scale(0.92); }
  to   { opacity: 1; transform: none; }
}

/* ---- the gap the copy sits in ---- */
.tc404__panel {
  position: relative;
  z-index: 1;
  max-width: 34rem;
  padding: clamp(1.75rem, 5vw, 3rem);
  background: var(--subfloor);
  color: var(--chalk);
  border-radius: 3px;
  transform: rotate(-0.5deg);
  box-shadow:
    0 0 0 5px var(--grout),
    0 26px 60px -12px rgb(0 0 0 / 0.75);
  animation: tc404-lift 520ms 240ms both cubic-bezier(.2,.8,.3,1);
}

@keyframes tc404-lift {
  from { opacity: 0; transform: rotate(-0.5deg) translateY(14px); }
  to   { opacity: 1; transform: rotate(-0.5deg) translateY(0); }
}

.tc404__eyebrow {
  margin: 0 0 1.1rem;
  font: 600 0.75rem/1 'IBM Plex Mono', ui-monospace, monospace;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ochre);
}

.tc404__title {
  margin: 0 0 1rem;
  font: 800 clamp(1.9rem, 5.5vw, 2.9rem)/1.04
        'Bricolage Grotesque', system-ui, sans-serif;
  letter-spacing: -0.025em;
}

.tc404__body {
  margin: 0 0 1.75rem;
  font: 400 1rem/1.6 system-ui, -apple-system, 'Segoe UI', sans-serif;
  color: hsl(40 12% 91% / 0.72);
  max-width: 34ch;
}

.tc404__path {
  font: 400 0.9em/1 'IBM Plex Mono', ui-monospace, monospace;
  padding: 0.15em 0.4em;
  border-radius: 2px;
  background: hsl(186 40% 60% / 0.14);
  color: var(--chalk);
  word-break: break-all;
}

.tc404__actions { display: flex; flex-wrap: wrap; gap: 0.7rem; }

.tc404__btn {
  font: 600 0.9rem/1 'IBM Plex Mono', ui-monospace, monospace;
  letter-spacing: 0.02em;
  padding: 0.8rem 1.25rem;
  border-radius: 2px;
  border: 1px solid transparent;
  text-decoration: none;
  cursor: pointer;
  transition: transform 120ms ease, background 120ms ease, color 120ms ease;
}
.tc404__btn:hover { transform: translateY(-2px); }
.tc404__btn:focus-visible {
  outline: 2px solid var(--ochre);
  outline-offset: 3px;
}

.tc404__btn--solid { background: var(--ochre); color: #1A1206; }
.tc404__btn--solid:hover { background: #F2B458; }

.tc404__btn--ghost {
  background: transparent;
  color: var(--chalk);
  border-color: hsl(40 12% 91% / 0.28);
}
.tc404__btn--ghost:hover { background: hsl(40 12% 91% / 0.08); }

.tc404__tally {
  margin: 1.5rem 0 0;
  min-height: 1.2em;
  font: 400 0.8rem/1.4 'IBM Plex Mono', ui-monospace, monospace;
  color: hsl(40 12% 91% / 0.5);
}
.tc404__tally strong { color: var(--ochre); font-weight: 600; }
.tc404__hint { opacity: 0.65; }

@media (max-width: 560px) {
  .tc404__floor {
    grid-template-columns: repeat(auto-fill, minmax(44px, 1fr));
    grid-auto-rows: 44px;
    gap: 4px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tc404__tile, .tc404__panel { animation: none; }
  .tc404__tile, .tc404__btn { transition: none; }
  .tc404__btn:hover { transform: none; }
}
`;
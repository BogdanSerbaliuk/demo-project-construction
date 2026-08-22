import { useMemo } from "react";

// Drawn straight into the SVG rather than via Tailwind classes, because these
// are data colours and the legend below has to reuse them. Real materials:
// bone ceramic for a tile laid whole, fired clay for one cut from a new tile,
// and a muted green where the piece came out of an offcut.
const COLORS = {
    outline: "#292524",
    label: "#2b2118",
    full: { fill: "#e9e3d9", stroke: "#bfb5a5" },
    new: { fill: "#cf8b5c", stroke: "#a15c34" },
    offcut: { fill: "#8ca87a", stroke: "#5f7a4f" },
};

function TileLayout({ layout, sourceByKey = {}, showLabels = true }) {
    const { tiles, roomL, roomW, tileW, tileH, full, cut, tooDense } = layout;

    // Everything is drawn in millimetres and the viewBox does the scaling, so
    // there is no pixels-per-metre maths and it stays sharp at any width.
    const pad = Math.max(roomL, roomW) * 0.04;
    const stroke = Math.max(roomL, roomW) / 400;
    const fontSize = Math.max(roomL, roomW) / 45;

    const labels = useMemo(
        () =>
            showLabels
                ? placeLabels({ tiles, roomL, roomW, tileW, tileH, fontSize })
                : new Map(),
        [tiles, roomL, roomW, tileW, tileH, fontSize, showLabels],
    );

    if (!tiles.length) {
        return (
            <div className="flex h-64 items-center justify-center rounded-2xl bg-gray-800 px-6 text-center text-sm text-gray-400 ring-1 ring-gray-700">
                {tooDense
                    ? "Too many tiles to preview at this room size"
                    : "Enter room dimensions to see the layout"}
            </div>
        );
    }

    return (
        <figure className="flex flex-col gap-3">
            <svg
                viewBox={`${-pad} ${-pad} ${roomL + pad * 2} ${roomW + pad * 2}`}
                className="w-full rounded-2xl bg-gray-800 ring-1 ring-gray-700"
                role="img"
                aria-label={`Tile layout preview: ${full} full tiles and ${cut} cut pieces`}
            >
                <g>
                    {tiles.map((tile) => {
                        const tone = tile.isFull
                            ? COLORS.full
                            : COLORS[sourceByKey[tile.key] ?? "new"];

                        return (
                            <polygon
                                key={tile.key}
                                points={tile.points}
                                fill={tone.fill}
                                stroke={tone.stroke}
                                strokeWidth={stroke}
                            />
                        );
                    })}
                </g>

                {/* Labels go in after every tile, or a neighbour drawn later
                    would paint over one that had borrowed its space. */}
                <g>
                    {[...labels].map(([key, label]) => (
                        <g key={key}>
                            {label.leader && (
                                <>
                                    <circle
                                        cx={label.leader.x1}
                                        cy={label.leader.y1}
                                        r={stroke * 1.5}
                                        fill={COLORS.label}
                                    />
                                    <line
                                        x1={label.leader.x1}
                                        y1={label.leader.y1}
                                        x2={label.leader.x2}
                                        y2={label.leader.y2}
                                        stroke={COLORS.label}
                                        strokeWidth={stroke}
                                        opacity="0.65"
                                    />
                                </>
                            )}
                            <text
                                x={label.x}
                                y={label.y}
                                transform={
                                    label.upright
                                        ? `rotate(-90 ${label.x} ${label.y})`
                                        : undefined
                                }
                                fill={COLORS.label}
                                fontSize={fontSize}
                                fontWeight="600"
                                textAnchor="middle"
                                dominantBaseline="central"
                            >
                                {label.text}
                            </text>
                        </g>
                    ))}
                </g>

                <rect
                    x="0"
                    y="0"
                    width={roomL}
                    height={roomW}
                    fill="none"
                    stroke={COLORS.outline}
                    strokeWidth={stroke * 2.5}
                />
            </svg>

            <figcaption className="flex flex-col gap-2 text-sm text-gray-300">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <Swatch tone={COLORS.full}>{full} laid whole</Swatch>
                    <Swatch tone={COLORS.new}>
                        {countBy(sourceByKey, "new")} cut from a new tile
                    </Swatch>
                    <Swatch tone={COLORS.offcut}>
                        {countBy(sourceByKey, "offcut")} cut from an offcut
                    </Swatch>
                </div>
                {showLabels && (
                    <span className="text-xs text-gray-500">
                        Cut sizes in mm, measured across the piece.
                    </span>
                )}
            </figcaption>
        </figure>
    );
}

/**
 * Works out where each cut size can be written.
 *
 * A piece takes its own label if the text fits inside it, flat or turned on
 * its side. Anything smaller borrows the space next to it, stepping away from
 * the wall that cut it and pointing back with a leader.
 *
 * Placement is then first come, first served against everything already down:
 * pieces that hold their own label are placed first, so a borrowed one can
 * never push out the label of the piece it is borrowing from. On a square-on
 * grid the borrowed space is a whole tile, which carries no label anyway; on a
 * 45° grid the tile axes no longer line up with the walls and the borrowed
 * space can be another cut piece, which is what the overlap test is for.
 */
function placeLabels({ tiles, roomL, roomW, tileW, tileH, fontSize }) {
    const gap = fontSize * 0.35;
    const placed = [];
    const labels = new Map();

    const candidates = tiles
        .filter((tile) => !tile.isFull)
        .map((tile) => {
            const text = `${tile.cutW}×${tile.cutH}`;
            const run = fontSize * text.length * 0.6; // along the text
            const rise = fontSize * 1.4; // across it

            const across = tile.boxW > run && tile.boxH > rise;
            const upright = !across && tile.boxH > run && tile.boxW > rise;
            const borrows = !across && !upright;

            const stepAway = (isCut, extent, textExtent, at, span) =>
                isCut ? (at < span / 2 ? 1 : -1) * (extent / 2 + textExtent / 2 + gap) : 0;

            return {
                tile,
                text,
                run,
                upright,
                borrows,
                x: tile.labelX + (borrows ? stepAway(tile.cutW < tileW, tile.boxW, run, tile.labelX, roomL) : 0),
                y: tile.labelY + (borrows ? stepAway(tile.cutH < tileH, tile.boxH, rise, tile.labelY, roomW) : 0),
                w: upright ? rise : run,
                h: upright ? run : rise,
                area: tile.boxW * tile.boxH,
            };
        })
        .sort((a, b) => Number(a.borrows) - Number(b.borrows) || b.area - a.area);

    for (const candidate of candidates) {
        const box = {
            left: candidate.x - candidate.w / 2,
            right: candidate.x + candidate.w / 2,
            top: candidate.y - candidate.h / 2,
            bottom: candidate.y + candidate.h / 2,
        };

        // Never write off the edge of the floor, nor over a label already down.
        if (box.left < 0 || box.right > roomL || box.top < 0 || box.bottom > roomW) continue;
        if (placed.some((other) => overlaps(other, box))) continue;

        placed.push(box);

        labels.set(candidate.tile.key, {
            text: candidate.text,
            x: candidate.x,
            y: candidate.y,
            upright: candidate.upright,
            leader: candidate.borrows ? leaderTo(candidate, gap) : null,
        });
    }

    return labels;
}

/** Line from the piece it describes, stopping short of the text itself. */
function leaderTo(candidate, gap) {
    const { tile, run } = candidate;
    const dx = candidate.x - tile.labelX;
    const dy = candidate.y - tile.labelY;
    const span = Math.hypot(dx, dy) || 1;
    const stop = Math.max(0, span - (run / 2 + gap));

    return {
        x1: tile.labelX,
        y1: tile.labelY,
        x2: tile.labelX + (dx / span) * stop,
        y2: tile.labelY + (dy / span) * stop,
    };
}

const overlaps = (a, b) =>
    a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

function Swatch({ tone, children }) {
    return (
        <span className="flex items-center gap-2">
            <span
                aria-hidden="true"
                className="inline-block h-3.5 w-3.5 rounded-sm"
                style={{ background: tone.fill, border: `1px solid ${tone.stroke}` }}
            />
            {children}
        </span>
    );
}

const countBy = (sourceByKey, source) =>
    Object.values(sourceByKey).filter((value) => value === source).length;

export default TileLayout;

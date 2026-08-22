// Pure tile maths — no React in this file on purpose. It keeps the module
// unit-testable, and lets the same numbers be recomputed on a server later
// instead of trusting whatever the browser sends.

// Tiles are laid edge to edge at these sizes — the size is both the ceramic
// and the pitch it repeats on.
export const TILE_PRESETS = [
    { id: "300x300", label: "300 × 300", w: 300, h: 300, perBox: 11 },
    { id: "600x600", label: "600 × 600", w: 600, h: 600, perBox: 4 },
    { id: "200x600", label: "200 × 600", w: 200, h: 600, perBox: 8 },
    { id: "1200x600", label: "1200 × 600", w: 1200, h: 600, perBox: 2 },
];

// `waste` is the trade rule-of-thumb margin, kept only so the computed
// figure has something to be compared against. `offset` and `angle` are
// what actually drive the layout.
export const PATTERN_PRESETS = [
    { id: "straight", label: "Straight lay", waste: 0.10, offset: false, angle: 0 },
    { id: "offset", label: "Offset / brick", waste: 0.15, offset: true, angle: 0 },
    { id: "diagonal", label: "Diagonal", waste: 0.20, offset: false, angle: 45 },
];

export const DEFAULT_CUT_SIDES = { top: true, right: true, bottom: true, left: true };

// Centred on both axes: the fallback when nothing says otherwise.
const CENTERED = { anchorX: "center", anchorY: "center" };

/**
 * Turns the walls you are willing to cut against into grid anchors.
 *
 * A tiler chooses this by deciding where the first whole tile goes: lay flush
 * against a wall and that wall needs no cut, but the opposite one takes the
 * entire remainder. Centre the axis instead and the remainder splits between
 * both walls.
 *
 * That is the whole vocabulary, which is why an axis cannot have *no* cut
 * side — unless the room happens to divide exactly by the tile, in which case
 * there are no cuts either way and the choice stops mattering.
 *
 * @param {{top: boolean, right: boolean, bottom: boolean, left: boolean}} sides
 */
export function anchorsForSides(sides) {
    return {
        anchorX: axisAnchor(sides.left, sides.right),
        anchorY: axisAnchor(sides.top, sides.bottom),
    };
}

// `near` is the low-coordinate wall (left / top), `far` the high one.
function axisAnchor(cutNear, cutFar) {
    if (cutNear && cutFar) return "center";
    if (cutNear) return "end"; // flush against the far wall, so the near one is cut
    return "start"; // flush against the near wall — also the fallback for neither
}

// Spare tiles for breakage on site, on top of the computed requirement.
export const BREAKAGE = 0.05;

// An offcut smaller than this in either direction goes in the skip — no
// tiler is cutting a usable piece out of a 30 mm sliver.
const MIN_USABLE_MM = 50;

// Pieces this thin are artefacts of where the grid happened to land, not
// real cuts, so they are dropped from the layout entirely.
const MIN_PIECE_MM = 5;

// Above this many candidate tiles the preview stops being readable and
// starts being 30k DOM nodes, so the visualiser bails out instead.
const MAX_PREVIEW_TILES = 6000;

/**
 * The trade rule of thumb: area ÷ tile area, plus a flat waste percentage.
 * Fast and pattern-blind — kept as a sanity check against the real layout.
 *
 * @param {object} input
 * @param {number} input.length room length, metres
 * @param {number} input.width  room width, metres
 * @param {number} input.tileW  tile width, mm
 * @param {number} input.tileH  tile height, mm
 * @param {number} input.waste  fraction, e.g. 0.10
 * @param {number} input.perBox tiles per box
 */
export function countTiles({ length, width, tileW, tileH, waste, perBox }) {
    const area = length * width;
    const tileArea = (tileW / 1000) * (tileH / 1000); // m² per tile

    if (area <= 0 || tileArea <= 0) return { tilesNeeded: 0, boxes: 0 };

    const tilesNeeded = Math.ceil((area / tileArea) * (1 + waste));

    // You buy whole boxes, so the real purchase is always >= tilesNeeded.
    return { tilesNeeded, boxes: Math.ceil(tilesNeeded / perBox) };
}

/* ------------------------------------------------------------------ */
/* Layout geometry                                                     */
/* ------------------------------------------------------------------ */

/**
 * Lays a tile grid over the room in millimetre space, clips every tile to
 * the room outline, and measures what is left. Diagonal patterns are the
 * same grid rotated about the room centre, so all three share one path.
 *
 * Each tile carries the polygon to draw plus `cutW`/`cutH`: the size of
 * blank the piece has to be cut from, measured back in the tile's own
 * un-rotated axes. For a diagonal cut that piece is a triangle, so the
 * blank is its bounding box — deliberately conservative, since you cannot
 * cut a triangle out of anything smaller.
 *
 * @param {object} input
 * @param {number} input.roomL room length, mm
 * @param {number} input.roomW room width, mm
 * @param {number} input.tileW tile width, mm
 * @param {number} input.tileH tile height, mm
 * @param {object} input.pattern one of PATTERN_PRESETS
 * @param {object} input.cutSides grid anchors, from anchorsForSides()
 */
export function buildLayout({ roomL, roomW, tileW, tileH, pattern, cutSides = CENTERED }) {
    if (roomL <= 0 || roomW <= 0 || tileW <= 0 || tileH <= 0) return EMPTY_LAYOUT;

    const { offset, angle } = pattern;
    const cx = roomL / 2;
    const cy = roomW / 2;
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const rotate = (px, py) => {
        const dx = px - cx;
        const dy = py - cy;
        return [cx + dx * cos - dy * sin, cy + dx * sin + dy * cos];
    };

    // Same rotation the other way, to read a clipped piece back in tile axes.
    const unrotate = (px, py) => {
        const dx = px - cx;
        const dy = py - cy;
        return [cx + dx * cos + dy * sin, cy - dx * sin + dy * cos];
    };

    // A rotated grid has to cover the room's diagonal, not just its sides.
    const reach = Math.hypot(roomL, roomW) / 2 + Math.max(tileW, tileH);

    // Where a tile boundary falls relative to the walls is what decides which
    // walls get the cuts. Rotating the grid destroys that relationship, so a
    // diagonal layout is always centred and always cuts against every wall.
    const square = angle === 0;
    const phaseX = phaseFor(square ? cutSides.anchorX : "center", roomL, tileW);
    const phaseY = phaseFor(square ? cutSides.anchorY : "center", roomW, tileH);

    // Indices run outward from the anchored boundary rather than from a corner,
    // so the phase survives however far the grid has to reach.
    const firstCol = Math.floor((cx - reach - phaseX) / tileW);
    const lastCol = Math.ceil((cx + reach - phaseX) / tileW);
    const firstRow = Math.floor((cy - reach - phaseY) / tileH);
    const lastRow = Math.ceil((cy + reach - phaseY) / tileH);

    if ((lastCol - firstCol + 1) * (lastRow - firstRow + 1) > MAX_PREVIEW_TILES) {
        return { ...EMPTY_LAYOUT, tooDense: true };
    }

    const tiles = [];
    let full = 0;
    let cut = 0;

    for (let r = firstRow; r <= lastRow; r++) {
        const y = phaseY + r * tileH;
        // Row indices go negative below the anchor, so take the absolute value
        // before testing which rows are the shifted ones.
        const shift = offset && Math.abs(r % 2) === 1 ? tileW / 2 : 0;

        for (let c = firstCol; c <= lastCol; c++) {
            const x = phaseX + c * tileW + shift;

            const quad = [
                rotate(x, y),
                rotate(x + tileW, y),
                rotate(x + tileW, y + tileH),
                rotate(x, y + tileH),
            ];

            // Cheap bounding-box reject before the real clip.
            const qxs = quad.map((p) => p[0]);
            const qys = quad.map((p) => p[1]);
            if (
                Math.max(...qxs) <= 0 ||
                Math.min(...qxs) >= roomL ||
                Math.max(...qys) <= 0 ||
                Math.min(...qys) >= roomW
            ) {
                continue;
            }

            const clipped = clipToRect(quad, roomL, roomW);
            if (clipped.length < 3) continue;

            // Half a millimetre of slack absorbs floating-point drift from the
            // rotation, so tiles sitting exactly on the edge count as full.
            const isFull =
                Math.min(...qxs) >= -0.5 &&
                Math.max(...qxs) <= roomL + 0.5 &&
                Math.min(...qys) >= -0.5 &&
                Math.max(...qys) <= roomW + 0.5;

            // Measure the surviving piece in the tile's own axes.
            const local = clipped.map(([px, py]) => unrotate(px, py));
            const lxs = local.map((p) => p[0] - x);
            const lys = local.map((p) => p[1] - y);
            const cutW = clamp(Math.round(Math.max(...lxs) - Math.min(...lxs)), 0, tileW);
            const cutH = clamp(Math.round(Math.max(...lys) - Math.min(...lys)), 0, tileH);

            if (cutW < MIN_PIECE_MM || cutH < MIN_PIECE_MM) continue;

            if (isFull) full++;
            else cut++;

            const bxs = clipped.map((p) => p[0]);
            const bys = clipped.map((p) => p[1]);
            const minX = Math.min(...bxs);
            const maxX = Math.max(...bxs);
            const minY = Math.min(...bys);
            const maxY = Math.max(...bys);

            tiles.push({
                key: `${r}-${c}`,
                points: clipped.map(([px, py]) => `${px},${py}`).join(" "),
                isFull,
                cutW,
                cutH,
                // Label anchor and the room-space room available for it.
                labelX: (minX + maxX) / 2,
                labelY: (minY + maxY) / 2,
                boxW: maxX - minX,
                boxH: maxY - minY,
            });
        }
    }

    return { tiles, full, cut, tooDense: false, roomL, roomW, tileW, tileH };
}

const EMPTY_LAYOUT = {
    tiles: [],
    full: 0,
    cut: 0,
    tooDense: false,
    roomL: 0,
    roomW: 0,
    tileW: 0,
    tileH: 0,
};

/**
 * Position of a tile boundary along one axis, which fixes where the cuts land.
 *
 *   "start"  — a tile edge sits on the near wall, so that wall needs no cut
 *              and the far wall takes the whole remainder.
 *   "end"    — the mirror of that: the far wall is flush, the near one is cut.
 *   "center" — the remainder is split evenly, so both walls get a part tile.
 */
function phaseFor(anchor, span, tile) {
    // Whatever the whole tiles leave over is exactly what the cuts absorb.
    const remainder = span % tile;

    if (anchor === "start") return 0; // near wall flush, far wall cut
    if (anchor === "end") return remainder; // far wall flush, near wall cut
    return remainder / 2; // split between the two
}

/** Sutherland–Hodgman against the four room edges. */
function clipToRect(polygon, roomL, roomW) {
    let poly = polygon;
    poly = clipEdge(poly, 0, 0, false); // x >= 0
    poly = clipEdge(poly, 0, roomL, true); // x <= roomL
    poly = clipEdge(poly, 1, 0, false); // y >= 0
    poly = clipEdge(poly, 1, roomW, true); // y <= roomW
    return poly;
}

function clipEdge(poly, axis, limit, keepBelow) {
    if (poly.length === 0) return poly;

    const inside = (p) => (keepBelow ? p[axis] <= limit : p[axis] >= limit);
    const out = [];

    for (let i = 0; i < poly.length; i++) {
        const cur = poly[i];
        const prev = poly[(i + poly.length - 1) % poly.length];
        const curIn = inside(cur);
        const prevIn = inside(prev);

        // Crossing the boundary adds the intersection point, in either direction.
        if (curIn !== prevIn) {
            const span = cur[axis] - prev[axis];
            const t = span === 0 ? 0 : (limit - prev[axis]) / span;
            out.push([prev[0] + t * (cur[0] - prev[0]), prev[1] + t * (cur[1] - prev[1])]);
        }
        if (curIn) out.push(cur);
    }

    return out;
}

/* ------------------------------------------------------------------ */
/* Cutting plan                                                        */
/* ------------------------------------------------------------------ */

/**
 * Works out how many whole tiles have to be opened to produce a set of cut
 * pieces, reusing the offcut left over from an earlier cut wherever one is
 * big enough.
 *
 * Guillotine model: a cut runs edge to edge, so taking a w × h piece out of
 * a W × H blank leaves exactly two rectangles — (W-w) × H beside it and
 * w × (H-h) below it. Pieces are placed largest first, into the smallest
 * offcut that fits; both are the standard greedy heuristics, and both can
 * be beaten by an optimal packing. This is a quoting tool, not a CNC nest.
 *
 * Pieces keep the orientation the layout gave them — the grid runs one way,
 * and a tile turned to suit the offcut would land with its edge across the
 * pattern.
 *
 * @param {Array<{key: string, w: number, h: number}>} pieces required pieces, mm
 * @param {object} options
 * @param {number} options.tileW full tile width, mm
 * @param {number} options.tileH full tile height, mm
 */
export function planCuts(pieces, { tileW, tileH }) {
    const ordered = [...pieces].sort((a, b) => b.w * b.h - a.w * a.h);
    const offcuts = [];
    const sourceByKey = {};

    let tilesOpened = 0;
    let piecesFromOffcuts = 0;

    for (const piece of ordered) {
        let bestIndex = -1;
        let bestArea = Infinity;

        offcuts.forEach((offcut, index) => {
            const area = offcut.w * offcut.h;
            if (area >= bestArea) return;

            if (piece.w <= offcut.w && piece.h <= offcut.h) {
                bestIndex = index;
                bestArea = area;
            }
        });

        let blank;
        if (bestIndex >= 0) {
            blank = offcuts.splice(bestIndex, 1)[0];
            piecesFromOffcuts++;
            sourceByKey[piece.key] = "offcut";
        } else {
            blank = { w: tileW, h: tileH };
            tilesOpened++;
            sourceByKey[piece.key] = "new";
        }

        const remainders = [
            { w: blank.w - piece.w, h: blank.h },
            { w: piece.w, h: blank.h - piece.h },
        ];

        for (const remainder of remainders) {
            if (remainder.w >= MIN_USABLE_MM && remainder.h >= MIN_USABLE_MM) {
                offcuts.push(remainder);
            }
        }
    }

    return { tilesOpened, piecesFromOffcuts, sourceByKey };
}

/**
 * Turns a layout into a shopping list: full tiles, plus the tiles that have
 * to be opened for the cut pieces once offcuts are reused, plus breakage,
 * rounded up to whole boxes.
 */
export function estimateFromLayout(layout, { perBox, boxPrice = 0, breakage = BREAKAGE }) {
    const pieces = layout.tiles
        .filter((tile) => !tile.isFull)
        .map((tile) => ({ key: tile.key, w: tile.cutW, h: tile.cutH }));

    const plan = planCuts(pieces, { tileW: layout.tileW, tileH: layout.tileH });

    const tilesUsed = layout.full + plan.tilesOpened;
    const tilesNeeded = Math.ceil(tilesUsed * (1 + breakage));
    const boxes = perBox > 0 ? Math.ceil(tilesNeeded / perBox) : 0;
    const tilesPurchased = boxes * perBox;

    return {
        fullTiles: layout.full,
        cutPieces: pieces.length,
        tilesOpened: plan.tilesOpened,
        piecesFromOffcuts: plan.piecesFromOffcuts,
        tilesUsed,
        tilesNeeded,
        boxes,
        tilesPurchased,
        leftover: tilesPurchased - tilesNeeded,
        cost: Math.round(boxes * boxPrice),
        sourceByKey: plan.sourceByKey,
    };
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);


import { describe, expect, it } from "vitest";
import {
    PATTERN_PRESETS,
    anchorsForSides,
    buildLayout,
    countTiles,
    estimateFromLayout,
    planCuts,
} from "./tiles";

const STRAIGHT = PATTERN_PRESETS.find((p) => p.id === "straight");
const OFFSET = PATTERN_PRESETS.find((p) => p.id === "offset");
const DIAGONAL = PATTERN_PRESETS.find((p) => p.id === "diagonal");

const ALL_SIDES = { top: true, right: true, bottom: true, left: true };

/** A 4 x 3 m room in 600 mm tiles unless the test.jsx says otherwise. */
const layoutOf = (overrides = {}) =>
    buildLayout({
        roomL: 4000,
        roomW: 3000,
        tileW: 600,
        tileH: 600,
        pattern: STRAIGHT,
        cutSides: anchorsForSides(ALL_SIDES),
        ...overrides,
    });

const cutsOf = (layout) => layout.tiles.filter((tile) => !tile.isFull);
const sizesOf = (layout) => [...new Set(cutsOf(layout).map((t) => `${t.cutW}x${t.cutH}`))].sort();

/**
 * Which walls actually cut a piece. Touching a wall is not being cut by it —
 * the piece also has to be short on that axis.
 */
function wallsCut(layout, tile = 600) {
    const hit = new Set();
    const eps = 1;

    for (const piece of cutsOf(layout)) {
        const minX = piece.labelX - piece.boxW / 2;
        const maxX = piece.labelX + piece.boxW / 2;
        const minY = piece.labelY - piece.boxH / 2;
        const maxY = piece.labelY + piece.boxH / 2;

        if (piece.cutW < tile - eps) {
            if (minX <= eps) hit.add("left");
            if (maxX >= layout.roomL - eps) hit.add("right");
        }
        if (piece.cutH < tile - eps) {
            if (minY <= eps) hit.add("top");
            if (maxY >= layout.roomW - eps) hit.add("bottom");
        }
    }

    return [...hit].sort();
}

describe("anchorsForSides", () => {
    it("centres an axis when both of its walls are cut", () => {
        expect(anchorsForSides(ALL_SIDES)).toEqual({ anchorX: "center", anchorY: "center" });
    });

    it("lays flush against the wall that is not being cut", () => {
        // Cutting only the left means the far (right) wall is flush.
        expect(anchorsForSides({ ...ALL_SIDES, right: false }).anchorX).toBe("end");
        expect(anchorsForSides({ ...ALL_SIDES, left: false }).anchorX).toBe("start");
        expect(anchorsForSides({ ...ALL_SIDES, bottom: false }).anchorY).toBe("end");
        expect(anchorsForSides({ ...ALL_SIDES, top: false }).anchorY).toBe("start");
    });

    it("treats the two axes independently", () => {
        expect(anchorsForSides({ top: true, right: true, bottom: false, left: false })).toEqual({
            anchorX: "start",
            anchorY: "end",
        });
    });
});

describe("countTiles", () => {
    it("divides area by tile area and adds the waste margin", () => {
        // 9 m² / 0.36 m² = 25 tiles exactly, +10% = 27.5, rounded up.
        const result = countTiles({
            length: 3,
            width: 3,
            tileW: 600,
            tileH: 600,
            waste: 0.1,
            perBox: 4,
        });

        expect(result.tilesNeeded).toBe(28);
        expect(result.boxes).toBe(7); // whole boxes only
    });

    it("returns zero for a room with no area", () => {
        expect(
            countTiles({ length: 0, width: 3, tileW: 600, tileH: 600, waste: 0.1, perBox: 4 }),
        ).toEqual({ tilesNeeded: 0, boxes: 0 });
    });
});

describe("buildLayout — rooms that divide exactly", () => {
    it("lays 5 x 5 whole tiles in a 3 m square with no cuts at all", () => {
        const layout = layoutOf({ roomL: 3000, roomW: 3000 });

        expect(layout.full).toBe(25);
        expect(layout.cut).toBe(0);
    });

    it("does the same for a smaller tile", () => {
        const layout = layoutOf({ roomL: 3000, roomW: 3000, tileW: 300, tileH: 300 });

        expect(layout.full).toBe(100);
        expect(layout.cut).toBe(0);
    });

    it("does the same for a rectangular tile", () => {
        const layout = layoutOf({ roomL: 3600, roomW: 2400, tileW: 1200, tileH: 600 });

        expect(layout.full).toBe(12);
        expect(layout.cut).toBe(0);
    });
});

describe("buildLayout — where the remainder goes", () => {
    it("splits the remainder evenly when both walls of an axis are cut", () => {
        // 4000 - 6 x 600 = 400 left over, so 200 against each of the two walls.
        const layout = layoutOf();

        expect(layout.full).toBe(30);
        expect(layout.cut).toBe(10);
        expect(sizesOf(layout)).toEqual(["200x600"]);
        expect(wallsCut(layout)).toEqual(["left", "right"]);
    });

    it("gives the whole remainder to one wall when the other is flush", () => {
        const layout = layoutOf({
            cutSides: anchorsForSides({ top: true, right: true, bottom: true, left: false }),
        });

        expect(layout.full).toBe(30);
        expect(layout.cut).toBe(5); // one column of cuts instead of two
        expect(sizesOf(layout)).toEqual(["400x600"]);
        expect(wallsCut(layout)).toEqual(["right"]);
    });

    it("mirrors that when the opposite wall is flush", () => {
        const layout = layoutOf({
            cutSides: anchorsForSides({ top: true, right: false, bottom: true, left: true }),
        });

        expect(sizesOf(layout)).toEqual(["400x600"]);
        expect(wallsCut(layout)).toEqual(["left"]);
    });

    it("cuts every wall that is ticked, and no others", () => {
        // 4 x 2.8 leaves a remainder on both axes, so corners appear.
        const layout = layoutOf({ roomW: 2800 });

        expect(wallsCut(layout)).toEqual(["bottom", "left", "right", "top"]);
        expect(sizesOf(layout)).toEqual(["200x200", "200x600", "600x200"]);
    });
});

describe("buildLayout — patterns", () => {
    it("shifts alternate rows for an offset lay", () => {
        const layout = layoutOf({ pattern: OFFSET });

        // Half-tile shifted rows meet the side walls differently, so fewer
        // tiles survive whole than in the same room laid straight.
        expect(layout.full).toBe(28);
        expect(layout.cut).toBe(10);
        expect(sizesOf(layout)).toEqual(["200x600", "500x600"]);
    });

    it("cuts against every wall on the diagonal, whatever the anchors say", () => {
        const centred = layoutOf({ pattern: DIAGONAL });
        const flush = layoutOf({
            pattern: DIAGONAL,
            cutSides: anchorsForSides({ top: true, right: true, bottom: false, left: false }),
        });

        expect(centred.full).toBe(24);
        expect(centred.cut).toBe(34);
        // A 45° grid has no relationship to the walls, so anchoring is inert.
        expect(flush.full).toBe(centred.full);
        expect(flush.cut).toBe(centred.cut);
    });

    it("measures a diagonal piece by the blank it has to be cut from", () => {
        const layout = layoutOf({ pattern: DIAGONAL });

        // Triangles are measured by their bounding box in the tile's own axes,
        // and never exceed a whole tile.
        for (const piece of cutsOf(layout)) {
            expect(piece.cutW).toBeLessThanOrEqual(600);
            expect(piece.cutH).toBeLessThanOrEqual(600);
        }
    });
});

describe("buildLayout — guards", () => {
    it("returns an empty layout for a room with no size", () => {
        const layout = layoutOf({ roomL: 0 });

        expect(layout.tiles).toEqual([]);
        expect(layout.tooDense).toBe(false);
    });

    it("refuses to build a preview with too many tiles in it", () => {
        const layout = layoutOf({ roomL: 20000, roomW: 20000, tileW: 100, tileH: 100 });

        expect(layout.tooDense).toBe(true);
        expect(layout.tiles).toEqual([]);
    });

    it("reports the room and tile it was built with", () => {
        const layout = layoutOf();

        expect(layout.roomL).toBe(4000);
        expect(layout.roomW).toBe(3000);
        expect(layout.tileW).toBe(600);
        expect(layout.tileH).toBe(600);
    });
});

describe("planCuts", () => {
    const tile = { tileW: 600, tileH: 600 };

    it("opens one tile for a piece that uses the whole thing", () => {
        const plan = planCuts([{ key: "a", w: 600, h: 600 }], tile);

        expect(plan.tilesOpened).toBe(1);
        expect(plan.piecesFromOffcuts).toBe(0);
        expect(plan.sourceByKey).toEqual({ a: "new" });
    });

    it("takes the second piece out of the first one's offcut", () => {
        const plan = planCuts(
            [
                { key: "a", w: 600, h: 300 },
                { key: "b", w: 600, h: 290 },
            ],
            tile,
        );

        expect(plan.tilesOpened).toBe(1);
        expect(plan.piecesFromOffcuts).toBe(1);
        expect(plan.sourceByKey).toEqual({ a: "new", b: "offcut" });
    });

    it("opens a new tile when the offcut is too small", () => {
        const plan = planCuts(
            [
                { key: "a", w: 600, h: 300 },
                { key: "b", w: 600, h: 310 },
            ],
            tile,
        );

        expect(plan.tilesOpened).toBe(2);
        expect(plan.piecesFromOffcuts).toBe(0);
    });

    it("throws away an offcut too thin to be worth keeping", () => {
        // 600 - 580 = 20 mm of waste, under the usable minimum, so the second
        // piece cannot come out of it however small it is.
        const plan = planCuts(
            [
                { key: "a", w: 600, h: 580 },
                { key: "b", w: 600, h: 10 },
            ],
            tile,
        );

        expect(plan.tilesOpened).toBe(2);
    });

    it("places the largest piece first, whatever order they arrive in", () => {
        const ascending = planCuts(
            [
                { key: "small", w: 300, h: 300 },
                { key: "big", w: 600, h: 600 },
            ],
            tile,
        );

        // The big one takes a whole tile and leaves nothing, so the small one
        // has to open its own — the same answer either way round.
        expect(ascending.tilesOpened).toBe(2);
        expect(ascending.sourceByKey.big).toBe("new");
    });

    it("names a source for every piece it is given", () => {
        const pieces = [
            { key: "a", w: 600, h: 300 },
            { key: "b", w: 600, h: 200 },
            { key: "c", w: 400, h: 400 },
        ];
        const plan = planCuts(pieces, tile);

        expect(Object.keys(plan.sourceByKey).sort()).toEqual(["a", "b", "c"]);
        expect(plan.tilesOpened + plan.piecesFromOffcuts).toBe(pieces.length);
    });
});

describe("estimateFromLayout", () => {
    it("turns a layout into a shopping list", () => {
        const layout = layoutOf();
        const estimate = estimateFromLayout(layout, { perBox: 4, boxPrice: 1200 });

        expect(estimate.fullTiles).toBe(30);
        expect(estimate.cutPieces).toBe(10);
        expect(estimate.tilesOpened).toBe(4);
        expect(estimate.piecesFromOffcuts).toBe(6);

        // 30 whole + 4 opened for cuts, +5% breakage, rounded up to whole boxes.
        expect(estimate.tilesUsed).toBe(34);
        expect(estimate.tilesNeeded).toBe(36);
        expect(estimate.boxes).toBe(9);
        expect(estimate.tilesPurchased).toBe(36);
        expect(estimate.leftover).toBe(0);
        expect(estimate.cost).toBe(10800);
    });

    it("needs no cut tiles at all when the room divides exactly", () => {
        const layout = layoutOf({ roomL: 3000, roomW: 3000 });
        const estimate = estimateFromLayout(layout, { perBox: 4 });

        expect(estimate.cutPieces).toBe(0);
        expect(estimate.tilesOpened).toBe(0);
        expect(estimate.tilesUsed).toBe(25);
    });

    it("tags every cut piece as coming from a new tile or an offcut", () => {
        const layout = layoutOf();
        const estimate = estimateFromLayout(layout, { perBox: 4 });
        const sources = Object.values(estimate.sourceByKey);

        expect(sources).toHaveLength(estimate.cutPieces);
        expect(sources.filter((s) => s === "offcut")).toHaveLength(estimate.piecesFromOffcuts);
        expect(sources.filter((s) => s === "new")).toHaveLength(estimate.tilesOpened);
    });

    it("costs nothing when no price is given", () => {
        const estimate = estimateFromLayout(layoutOf(), { perBox: 4 });

        expect(estimate.cost).toBe(0);
    });
});

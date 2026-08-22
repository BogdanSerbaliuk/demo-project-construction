import { useMemo, useState } from "react";
import { ArrowLeftFromLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    BREAKAGE,
    DEFAULT_CUT_SIDES,
    PATTERN_PRESETS,
    TILE_PRESETS,
    anchorsForSides,
    buildLayout,
    countTiles,
    estimateFromLayout,
} from "../pricing/tiles";
import TileLayout from "../components/tileLayout.jsx";

function TileCounter() {
    const navigate = useNavigate();

    // Kept as strings so typing "0." or clearing a field does not get coerced
    // back mid-keystroke. They are parsed at the boundary instead.
    const [length, setLength] = useState("4");
    const [width, setWidth] = useState("3");
    const [boxPrice, setBoxPrice] = useState("1200");
    const [tileId, setTileId] = useState("600x600");
    const [patternId, setPatternId] = useState("straight");
    const [cutSides, setCutSides] = useState(DEFAULT_CUT_SIDES);
    const [showLabels, setShowLabels] = useState(true);

    const tile = TILE_PRESETS.find((item) => item.id === tileId);
    const pattern = PATTERN_PRESETS.find((item) => item.id === patternId);
    const anchors = useMemo(() => anchorsForSides(cutSides), [cutSides]);

    // An axis has to be cut somewhere, so once only one of a pair is ticked it
    // locks — there is no layout that cuts neither the left nor the right.
    const lockedX = cutSides.left !== cutSides.right;
    const lockedY = cutSides.top !== cutSides.bottom;

    const toggleSide = (side) =>
        setCutSides((prev) => ({ ...prev, [side]: !prev[side] }));

    // A 45° grid meets every wall at an angle, so no starting point can leave
    // one uncut and the control has nothing to say.
    const cutSidesApply = pattern.angle === 0;

    const layout = useMemo(
        () =>
            buildLayout({
                roomL: num(length) * 1000,
                roomW: num(width) * 1000,
                tileW: tile.w,
                tileH: tile.h,
                pattern,
                cutSides: anchors,
            }),
        [length, width, tile, pattern, anchors],
    );

    const result = useMemo(
        () =>
            estimateFromLayout(layout, {
                perBox: tile.perBox,
                boxPrice: num(boxPrice),
            }),
        [layout, tile, boxPrice],
    );

    // The flat-percentage figure, shown only so the computed one has a
    // reference point to be judged against.
    const ruleOfThumb = useMemo(
        () =>
            countTiles({
                length: num(length),
                width: num(width),
                tileW: tile.w,
                tileH: tile.h,
                waste: pattern.waste,
                perBox: tile.perBox,
            }),
        [length, width, tile, pattern],
    );

    return (
        <main className="min-h-screen w-full bg-gray-900 px-4 py-12 text-white sm:px-6">
            <div className="mx-auto w-full max-w-5xl">

                <button
                    type="button"
                    onClick={() => (window.history.length > 2 ? navigate(-1) : navigate("/"))}
                    className="sticky top-6 z-50 mb-6 inline-flex cursor-pointer items-center gap-3 rounded-md bg-blue-600 px-4 py-2 text-lg font-medium hover:bg-blue-700 active:scale-95"
                >
                    <ArrowLeftFromLine size={24} aria-hidden="true" />Back
                </button>

                <h1 className="text-3xl font-semibold sm:text-4xl">Tile Calculator</h1>

                <p className="mt-6 max-w-prose text-gray-300">
                    Enter the room dimensions to see how the chosen pattern falls across the
                    floor, what size each cut piece has to be, and how many whole tiles the
                    job actually consumes once offcuts are reused.
                </p>

                <div className="mt-12 grid gap-8 lg:grid-cols-2">

                    {/* ---- inputs ---- */}
                    <form className="flex flex-col gap-5" onSubmit={(event) => event.preventDefault()}>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Length (m)">
                                <NumberInput value={length} onChange={setLength} step="0.1" />
                            </Field>
                            <Field label="Width (m)">
                                <NumberInput value={width} onChange={setWidth} step="0.1" />
                            </Field>
                        </div>

                        <Field label="Tile size (mm)">
                            <select
                                value={tileId}
                                onChange={(event) => setTileId(event.target.value)}
                                className={CONTROL_CLASS}
                            >
                                {TILE_PRESETS.map((item) => (
                                    <option key={item.id} value={item.id} className="bg-gray-800">
                                        {item.label} — {item.perBox} per box
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <fieldset>
                            <legend className="mb-2 text-sm font-medium text-gray-300">
                                Layout pattern
                            </legend>
                            <div className="flex flex-wrap gap-2">
                                {PATTERN_PRESETS.map((item) => (
                                    <Toggle
                                        key={item.id}
                                        pressed={item.id === patternId}
                                        onClick={() => setPatternId(item.id)}
                                    >
                                        {item.label}
                                    </Toggle>
                                ))}
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend className="mb-2 text-sm font-medium text-gray-300">
                                Which sides get cut
                            </legend>

                            {/* Laid out as a plan of the room, so each box sits on
                                the wall it stands for. */}
                            <div className="grid grid-cols-3 gap-2">
                                <span />
                                <SideCheckbox
                                    label="Top"
                                    checked={cutSides.top}
                                    disabled={!cutSidesApply || (lockedY && cutSides.top)}
                                    onChange={() => toggleSide("top")}
                                />
                                <span />

                                <SideCheckbox
                                    label="Left"
                                    checked={cutSides.left}
                                    disabled={!cutSidesApply || (lockedX && cutSides.left)}
                                    onChange={() => toggleSide("left")}
                                />
                                <span className="flex items-center justify-center text-xs text-gray-600">
                                    room
                                </span>
                                <SideCheckbox
                                    label="Right"
                                    checked={cutSides.right}
                                    disabled={!cutSidesApply || (lockedX && cutSides.right)}
                                    onChange={() => toggleSide("right")}
                                />

                                <span />
                                <SideCheckbox
                                    label="Bottom"
                                    checked={cutSides.bottom}
                                    disabled={!cutSidesApply || (lockedY && cutSides.bottom)}
                                    onChange={() => toggleSide("bottom")}
                                />
                                <span />
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                                {cutSidesApply
                                    ? "Lay the first whole tile against a wall and that wall needs no cut. Each direction has to be cut somewhere, so the last box of a pair stays ticked."
                                    : "A diagonal layout meets every wall at an angle, so all four are cut."}
                            </p>
                        </fieldset>

                        <fieldset>
                            <legend className="mb-2 text-sm font-medium text-gray-300">
                                Preview
                            </legend>
                            <Toggle pressed={showLabels} onClick={() => setShowLabels((on) => !on)}>
                                Show cut sizes
                            </Toggle>
                        </fieldset>

                        <Field label="Price per box">
                            <NumberInput value={boxPrice} onChange={setBoxPrice} step="50" />
                        </Field>
                    </form>

                    {/* ---- preview + result ---- */}
                    <div className="flex flex-col gap-6">
                        <TileLayout
                            layout={layout}
                            sourceByKey={result.sourceByKey}
                            showLabels={showLabels}
                        />

                        <div className="rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-orange-950 p-6 ring-1 ring-gray-700">
                            <Row label="Full tiles" value={result.fullTiles} />
                            <Row label="Cut pieces needed" value={result.cutPieces} />
                            <Row
                                label="Pieces taken from offcuts"
                                value={result.piecesFromOffcuts}
                            />
                            <Row label="Tiles opened for cuts" value={result.tilesOpened} />

                            <div className="my-4 border-t border-gray-600" />

                            <Row label="Tiles consumed" value={result.tilesUsed} />
                            <Row
                                label={`Incl. +${Math.round(BREAKAGE * 100)}% breakage`}
                                value={result.tilesNeeded}
                            />
                            <Row label="Boxes to buy" value={result.boxes} strong />
                            <Row
                                label="Tiles in those boxes"
                                value={`${result.tilesPurchased} (${result.leftover} spare)`}
                            />

                            <div className="my-4 border-t border-gray-600" />

                            <div className="flex items-baseline justify-between gap-4">
                                <span className="text-sm text-gray-300">Estimated cost</span>
                                <span className="text-2xl font-semibold">
                                    {result.cost.toLocaleString()} ₴
                                </span>
                            </div>

                            <p className="mt-4 text-xs leading-relaxed text-gray-400">
                                The flat +{Math.round(pattern.waste * 100)}% rule of thumb would
                                call for {ruleOfThumb.tilesNeeded} tiles in {ruleOfThumb.boxes} boxes.
                                Both are indicative — the final quantity depends on the site survey
                                and tile batch availability.
                            </p>
                        </div>
                    </div>
                </div>

                <div role="status" aria-live="polite" className="sr-only">
                    {`${result.boxes} boxes, ${result.tilesNeeded} tiles, ${result.cost} total`}
                </div>
            </div>
        </main>
    );
}

/* ---------- local helpers ---------- */

const CONTROL_CLASS =
    "w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white " +
    "outline-none transition-colors focus:border-blue-500 focus-visible:outline " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500";

function Field({ label, children }) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-300">{label}</span>
            {children}
        </label>
    );
}

function NumberInput({ value, onChange, step = "1" }) {
    return (
        <input
            type="number"
            inputMode="decimal"
            min="0"
            step={step}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className={CONTROL_CLASS}
        />
    );
}

function SideCheckbox({ label, checked, disabled, onChange }) {
    return (
        <label
            className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                disabled
                    ? "cursor-not-allowed border-gray-700 text-gray-500"
                    : "cursor-pointer border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white"
            }`}
        >
            <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={onChange}
                className="h-4 w-4 accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            />
            {label}
        </label>
    );
}

function Toggle({ pressed, onClick, children }) {
    return (
        <button
            type="button"
            aria-pressed={pressed}
            onClick={onClick}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                pressed
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white"
            }`}
        >
            {children}
        </button>
    );
}

function Row({ label, value, strong }) {
    return (
        <div className="flex items-baseline justify-between gap-4 py-1">
            <span className="text-sm text-gray-300">{label}</span>
            <span className={strong ? "text-lg font-semibold" : "text-sm font-medium"}>
                {value}
            </span>
        </div>
    );
}

const num = (value) => (Number.isFinite(parseFloat(value)) ? parseFloat(value) : 0);

export default TileCounter;

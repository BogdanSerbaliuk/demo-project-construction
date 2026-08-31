import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, X } from "lucide-react";

/**
 * Photo carousel in a modal.
 *
 * The scrolling is native: `overflow-x-auto` plus scroll-snap gives touch
 * swipe, momentum and snapping for free, which is most of what a carousel
 * library sells. The arrows and dots only call `scrollTo`, and `index` is
 * read back off the real scroll position — so there is one source of truth
 * and no way for the controls and the view to disagree.
 */
function ProjectDialog({ project, onClose }) {
    const ref = useRef(null);
    const trackRef = useRef(null);
    const [index, setIndex] = useState(0);

    // Always four slots, so the layout is the same whether the photos exist
    // yet or not. Missing ones render as placeholders further down.
    const images = project.images ?? [];
    const slides = Array.from({ length: 4 }, (_, i) => images[i] ?? null);

    // showModal(), not show() — only the modal form gives a backdrop, a focus
    // trap and Escape-to-close. The component is rendered conditionally by the
    // parent, so mounting is the moment to open it.
    useEffect(() => {
        ref.current?.showModal();
    }, []);

    // Keep the dots in step with wherever the user has scrolled to.
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        let frame = null;

        // Every slide is exactly the track's width, so the index is a plain
        // division — no need to measure each slide individually.
        const sync = () => {
            frame = null;
            setIndex(Math.round(track.scrollLeft / track.clientWidth));
        };

        // Scroll fires many times per frame; queue at most one measurement
        // per frame instead of setting state on every event.
        const onScroll = () => {
            if (frame === null) frame = requestAnimationFrame(sync);
        };

        track.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            if (frame !== null) cancelAnimationFrame(frame);
            track.removeEventListener("scroll", onScroll);
        };
    }, []);

    // The single way anything moves the carousel: dots, arrows and keys all
    // come through here, so clamping only has to be written once.
    const goTo = (next) => {
        const track = trackRef.current;
        if (!track) return;

        const clamped = Math.max(0, Math.min(next, slides.length - 1));
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        track.scrollTo({ left: clamped * track.clientWidth, behavior: reduced ? "auto" : "smooth" });
    };

    return (
        <dialog
            ref={ref}
            onClose={onClose}
            onClick={(event) => {
                // ::backdrop is not a separate element — a click on it reports
                // the dialog itself as the target, while a click on the panel
                // reports something inside it.
                if (event.target === ref.current) onClose();
            }}
            // m-auto is doing the centring: Tailwind's Preflight sets
            // `margin: 0` on every element, which overrides the browser's own
            // `margin: auto` on <dialog>. Without it this sits in the corner.
            className="m-auto w-[calc(100%-2rem)] max-w-3xl rounded-2xl bg-white p-4 text-black ring-1 ring-gray-700 backdrop:bg-black/70 sm:p-6
            md:w-[calc(100%-4rem)] md:max-w-6xl
            "
        >
            <header className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">{project.title}</h2>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="shrink-0 cursor-pointer rounded border border-black px-4 py-2 transition hover:bg-black/5"
                >
                    <X size={18} />
                </button>
            </header>

            {/* relative so the arrows can be positioned over the track */}
            <div className="relative">
                <div
                    ref={trackRef}
                    tabIndex={0}
                    role="group"
                    aria-roledescription="carousel"
                    aria-label={`${project.title} photos`}
                    // tabIndex makes the track focusable so it can take key
                    // presses; preventDefault stops the page scrolling too.
                    onKeyDown={(event) => {
                        if (event.key === "ArrowRight") { event.preventDefault(); goTo(index + 1); }
                        if (event.key === "ArrowLeft")  { event.preventDefault(); goTo(index - 1); }
                    }}
                    // snap-x + snap-mandatory on the track and snap-center on
                    // each slide is the whole swipe behaviour.
                    className="flex snap-x snap-mandatory overflow-x-auto rounded-lg scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                    {slides.map((src, i) => (
                        <div
                            key={i}
                            aria-roledescription="slide"
                            aria-label={`${i + 1} of ${slides.length}`}
                            // flex-none matters: without it flex would shrink
                            // all four slides to fit side by side.
                            className="w-full flex-none snap-center"
                        >
                            {src ? (
                                <img
                                    src={src}
                                    alt={`${project.title} — view ${i + 1}`}
                                    className="aspect-video w-full object-cover"
                                />
                            ) : (
                                <div className="flex aspect-video w-full items-center justify-center border border-dashed border-gray-400 bg-gray-100 text-sm text-gray-500">
                                    Photo {i + 1}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    aria-label="Previous photo"
                    disabled={index === 0}
                    onClick={() => goTo(index - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/80 p-2 transition
                    hidden md:block
                    hover:bg-white disabled:pointer-events-none disabled:opacity-0"
                >
                    <ArrowLeftIcon size={20} />
                </button>

                <button
                    type="button"
                    aria-label="Next photo"
                    disabled={index === slides.length - 1}
                    onClick={() => goTo(index + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/80 p-2 transition
                    hidden md:block
                    hover:bg-white disabled:pointer-events-none disabled:opacity-0"
                >
                    <ArrowRightIcon size={20} />
                </button>
            </div>

            <div className="mt-4 flex justify-center gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Go to photo ${i + 1}`}
                        aria-current={i === index ? "true" : undefined}
                        className={`h-2 w-8 cursor-pointer rounded-full transition-colors ${
                            i === index ? "bg-black" : "bg-gray-300 hover:bg-gray-400"
                        }`}
                    />
                ))}
            </div>
        </dialog>
    );
}

export default ProjectDialog;
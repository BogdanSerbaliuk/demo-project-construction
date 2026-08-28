import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import backYardPhoto from "../pictures/backyard.webp";
import img1 from "../pictures/cards/aftersales.jpg";
import img2 from "../pictures/cards/beforeafter.jpg";
import img3 from "../pictures/cards/blueprints.jpg";
import img4 from "../pictures/cards/conccreete.jpg";
import img5 from "../pictures/cards/prefab.webp";
import Button from "./ui/button.jsx";

const CARDS = [
    {
        id: 1,
        title: "aftersales",
        description1: "Construction of houses and cottages",
        description2:
            "We turn your blueprint into a solid, comfortable home built to last for generations",
        image: img5,
    },
    {
        id: 2,
        title: "before and after",
        description1: "Individual planning",
        description2:
            "Every project starts from scratch, shaped entirely around your lifestyle, land, and vision",
        image: img3,
    },
    {
        id: 3,
        title: "blueprints",
        description1: "Concrete works",
        description2:
            "From foundations to driveways, we deliver precision pours that stand the test.jsx of time",
        image: img4,
    },
    {
        id: 4,
        title: "concrete",
        description1: "Modern renovation",
        description2:
            "We breathe new life into old spaces, blending contemporary design with lasting craftsmanship",
        image: img2,
    },
    {
        id: 5,
        title: "prefab",
        description1: "Warranty service",
        description2:
            "Our commitment doesn't end at handover — we stand behind our work long after the final brick is laid",
        image: img1,
    },
];

function Services() {
    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const getSlides = useCallback(
        () => Array.from(scrollRef.current?.querySelectorAll("[data-slide]") ?? []),
        [],
    );

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        let frame = null;

        // Geometry-based: the active slide is the one whose center is nearest the
        // track's center. Works for any slide width — no assumption that one slide
        // equals one clientWidth.
        const sync = () => {
            frame = null;
            const center = container.scrollLeft + container.clientWidth / 2;
            let nearest = 0;
            let smallest = Infinity;

            getSlides().forEach((slide, index) => {
                const distance = Math.abs(slide.offsetLeft + slide.clientWidth / 2 - center);
                if (distance < smallest) {
                    smallest = distance;
                    nearest = index;
                }
            });

            setActiveIndex(nearest);
        };

        const onScroll = () => {
            if (frame === null) frame = requestAnimationFrame(sync);
        };

        sync();
        container.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        return () => {
            if (frame !== null) cancelAnimationFrame(frame);
            container.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [getSlides]);

    const scrollToIndex = (index) => {
        const container = scrollRef.current;
        if (!container) return;

        const slides = getSlides();
        const slide = slides[Math.max(0, Math.min(index, slides.length - 1))];
        if (!slide) return;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        container.scrollTo({
            left: slide.offsetLeft - (container.clientWidth - slide.clientWidth) / 2,
            behavior: prefersReducedMotion ? "auto" : "smooth",
        });
    };

    const handleKeyDown = (event) => {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollToIndex(activeIndex + 1);
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollToIndex(activeIndex - 1);
        }
    };

    const arrowClasses =
        "hidden shrink-0 rounded-full p-4 text-white backdrop-blur-md transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-90 active:bg-blue-600 disabled:pointer-events-none disabled:opacity-30 md:inline-flex";

    return (
        <section className="relative isolate w-full overflow-hidden">
            <img
                src={backYardPhoto}
                alt=""
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative flex min-h-dvh w-full flex-col items-center justify-center gap-8 px-4 py-12 sm:px-6">

                <h2 className="sr-only">Our Services</h2>

                <div className="flex w-full max-w-6xl items-center justify-center gap-2 md:gap-6 lg:gap-12">
                    <button
                        type="button"
                        aria-label="Previous service"
                        disabled={activeIndex === 0}
                        onClick={() => scrollToIndex(activeIndex - 1)}
                        className={arrowClasses}
                    >
                        <ArrowLeftIcon className="size-8 lg:size-10" />
                    </button>

                    <div
                        ref={scrollRef}
                        tabIndex={0}
                        role="group"
                        aria-roledescription="carousel"
                        aria-label="Our services"
                        onKeyDown={handleKeyDown}
                        className="relative flex h-[clamp(18rem,60dvh,35rem)] w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden rounded-3xl scrollbar-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:w-4/5 lg:w-4/5"
                    >
                        {CARDS.map((card, index) => (
                            <article
                                key={card.id}
                                data-slide
                                aria-roledescription="slide"
                                aria-label={`${index + 1} of ${CARDS.length}`}

                                className="@container relative h-full w-full flex-none snap-center overflow-hidden"
                            >
                                <img
                                    src={card.image}
                                    alt=""
                                    loading={index === 0 ? "eager" : "lazy"}
                                    decoding="async"
                                    className="absolute inset-0 h-full w-full object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white @md:p-8">
                                    <h3 className="mb-2 text-lg font-semibold @sm:text-xl @lg:text-2xl">
                                        {card.description1}
                                    </h3>
                                    <p className="text-sm @sm:text-base @lg:text-lg">
                                        {card.description2}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>

                    <button
                        type="button"
                        aria-label="Next service"
                        disabled={activeIndex === CARDS.length - 1}
                        onClick={() => scrollToIndex(activeIndex + 1)}
                        className={arrowClasses}
                    >
                        <ArrowRightIcon className="size-8 lg:size-10" />
                    </button>
                </div>
                <div className="flex flex-row gap-2">
                    {CARDS.map((card, index) => (
                        <button
                            key={card.id}
                            type="button"
                            onClick={() => scrollToIndex(index)}
                            aria-label={`Go to ${card.description1}`}
                            aria-current={index === activeIndex ? "true" : undefined}
                            className="flex h-6 w-10 items-center rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            <span
                                className={`h-2 w-full rounded-full transition-colors ${
                                    index === activeIndex ? "bg-blue-600" : "bg-white/50 hover:bg-white/80"
                                }`}
                            />
                        </button>
                    ))}
                </div>

                <Button variant="primary" to="/services">Details</Button>
            </div>

            <div role="status" aria-live="polite" className="sr-only">
                {`Slide ${activeIndex + 1} of ${CARDS.length}: ${CARDS[activeIndex].description1}`}
            </div>
        </section>
    );
}

export default Services;

import { useEffect, useRef, useState } from "react";
import backYardPhoto from "../pictures/backyard.webp";
import img1 from "../pictures/cards/aftersales.jpg";
import img2 from "../pictures/cards/beforeafter.jpg";
import img3 from "../pictures/cards/blueprints.jpg";
import img4 from "../pictures/cards/conccreete.jpg";
import img5 from "../pictures/cards/prefab.webp";
import {ArrowLeftIcon, ArrowRightIcon, ChevronRightIcon} from "lucide-react";

function Services() {
    const cards = [
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
            title: "bleprints",
            description1: "Concrete works",
            description2:
                "From foundations to driveways, we deliver precision pours that stand the test of time",
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

    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            const index = Math.round(container.scrollLeft / container.clientWidth);
            setActiveIndex(index);
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToIndex = (index) => {
        const container = scrollRef.current;
        const width = container.clientWidth;
        container.scrollTo({left: index * width, behavior: "smooth"})
    };

    return (
        <section className="relative w-full h-screen">
            <img
                src={backYardPhoto}
                alt="Backyard"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-10">

                <div className="flex flex-row items-center justify-center gap-30 w-full">
                    <button
                        onClick={() => scrollToIndex(Math.max(activeIndex - 1, 0))}
                        className="text-white rounded-full p-4 backdrop-blur-md
                         hover:bg-white/10 active:scale-90 active:bg-blue-600"
                    >
                        <ArrowLeftIcon className="size-10"/>
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex w-3/5 h-[min(60vh,35rem)] rounded-3xl overflow-x-auto snap-x snap-mandatory
              [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
                    >
                        {cards.map((card) => (
                            <div key={card.id} className="flex-none w-full h-full snap-center">
                                <div className="relative w-full h-full overflow-hidden">
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/30" />

                                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                                        <h3 className="text-xl font-semibold mb-2">
                                            {card.description1}
                                        </h3>
                                        <p className="text-lg">{card.description2}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => scrollToIndex(Math.min(activeIndex + 1, cards.length - 1))}
                        className="text-white rounded-full p-4 backdrop-blur-md
                         hover:bg-white/10 active:scale-90 active:bg-blue-600 "
                    >
                        <ArrowRightIcon className="size-10"/>
                    </button>
                </div>

                <div className="flex flex-row gap-3">
                    {cards.map((card, index) => (
                        <button
                            key={card.id}
                            onClick={() => scrollToIndex(index)}
                            aria-label={`Go to ${card.description1}`}
                            className={`w-10 h-2 rounded-full transition-colors ${
                                index === activeIndex
                                    ? "bg-blue-600"
                                    : "bg-white/50 hover:bg-white/80"
                            }`}
                        />
                    ))}
                </div>
                <button className="text-white rounded-md px-12 py-4 font-medium bg-blue-600
                hover:bg-blue-700 active:scale-90">
                    Details
                </button>
            </div>
        </section>
    );
}

export default Services;
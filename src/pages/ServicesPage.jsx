// src/pages/ServicesPage.jsx
import { useEffect, useState } from "react";
import { ArrowLeftFromLine } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/button.jsx";

// One array drives the whole page: the side nav, the sections and the prices.
// `price: null` means the service is not sold by the unit.
const SERVICES = [
    {
        id: "houses",
        title: "Construction of Houses and Cottages",
        summary:
            "Turnkey builds from the first soil test.jsx to the day you get the keys.",
        includes: [
            "Site survey and soil testing",
            "Foundation and drainage",
            "Structural shell and roof",
            "Windows, doors and envelope",
            "Utilities brought to the building",
        ],
        price: 18000,
        unit: "₴ / m²",
        duration: "5–9 months",
        affects: ["Ground conditions", "Number of storeys", "Finish level", "Season"],
    },
    {
        id: "planning",
        title: "Individual Planning",
        summary:
            "Every project starts from scratch, shaped around your lifestyle, land and budget.",
        includes: [
            "Site and zoning assessment",
            "Concept sketches and revisions",
            "Working drawings",
            "Structural and utility layouts",
            "Permit documentation",
        ],
        price: 900,
        unit: "₴ / m²",
        duration: "4–10 weeks",
        affects: ["Floor area", "Number of revisions", "Permit complexity"],
    },
    {
        id: "concrete",
        title: "Concrete Works",
        summary:
            "Foundations, slabs and driveways poured to spec and cured properly.",
        includes: [
            "Excavation and formwork",
            "Reinforcement cages",
            "Supply and pour",
            "Curing and finishing",
            "Waterproofing",
        ],
        price: 4200,
        unit: "₴ / m³",
        duration: "1–4 weeks",
        affects: ["Concrete grade", "Rebar density", "Access for the mixer"],
    },
    {
        id: "renovation",
        title: "Modern Renovation",
        summary:
            "New life for old spaces, blending contemporary design with lasting craftsmanship.",
        includes: [
            "Strip-out and disposal",
            "Electrical and plumbing rework",
            "Levelling, plastering, screed",
            "Tiling and flooring",
            "Painting and finishing",
        ],
        price: 6500,
        unit: "₴ / m²",
        duration: "6–16 weeks",
        affects: ["Age of the building", "Whether layout changes", "Material grade"],
        tool: { label: "Estimate your tiling", to: "/tilecounter" },
    },
    {
        id: "warranty",
        title: "Warranty Service",
        summary:
            "Our commitment does not end at handover — we stand behind the work.",
        includes: [
            "5-year structural warranty",
            "2 years on finishes and fittings",
            "Scheduled first-year inspection",
            "Priority callout for warranty issues",
        ],
        price: null,
        unit: null,
        duration: "From handover",
        affects: [],
    },
];

function ServicesPage() {
    const navigate = useNavigate();
    const [activeId, setActiveId] = useState(SERVICES[0].id);

    // Highlight whichever section is currently in the reading band. The margins
    // shrink the viewport to a strip near the top, so the active link changes
    // when a heading reaches roughly a third of the way down.
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

                if (visible[0]) setActiveId(visible[0].target.id);
            },
            { rootMargin: "-30% 0px -60% 0px" },
        );

        SERVICES.forEach(({ id }) => {
            const section = document.getElementById(id);
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <main className="min-h-screen w-full bg-gray-900 px-4 py-12 text-white sm:px-6">
            <div className="mx-auto w-full max-w-6xl">

                <Button variant="primary" to="/" className="sticky top-6 z-50 mb-6 inline-flex cursor-pointer items-center gap-3 rounded-md bg-blue-600 px-4 py-2 text-lg font-semibold hover:bg-blue-700 active:scale-95"><ArrowLeftFromLine size={24} aria-hidden="true" />Back</Button>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Our Services</h1>

                <p className="mt-6 max-w-prose text-gray-300">
                    What each service covers, what it typically costs, and what moves that
                    number. Prices are indicative — a binding figure comes from a site survey.
                </p>

                <div className="mt-12 gap-12 lg:grid lg:grid-cols-[200px_1fr]">

                    {/* Side nav — sticky on desktop, hidden on mobile */}
                    <nav aria-label="Services" className="hidden lg:block">
                        <ul className="sticky top-24 flex flex-col gap-1">
                            {SERVICES.map((service) => (
                                <li key={service.id}>
                                    <a
                                        href={`#${service.id}`}
                                        aria-current={service.id === activeId ? "true" : undefined}
                                        className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                                            service.id === activeId
                                                ? "bg-gray-800 text-blue-400"
                                                : "text-gray-400 hover:text-white"
                                        }`}
                                    >
                                        {service.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="flex flex-col gap-16">
                        {SERVICES.map((service) => (
                            <ServiceSection key={service.id} service={service} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

function ServiceSection({ service }) {
    return (
        <section id={service.id} className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight">{service.title}</h2>
            <p className="mt-3 max-w-prose text-gray-300">{service.summary}</p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                        What is included
                    </h3>
                    <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-gray-300">
                        {service.includes.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>

                <div className="rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-orange-950 p-6 ring-1 ring-gray-700">
                    {service.price ? (
                        <>
                            <span className="text-sm text-gray-300">From</span>
                            <p className="text-3xl font-semibold tabular-nums">
                                {service.price.toLocaleString()}
                                <span className="ml-2 text-base font-normal text-gray-300">
                                    {service.unit}
                                </span>
                            </p>
                        </>
                    ) : (
                        <p className="text-2xl font-semibold tracking-tight">Included with every project</p>
                    )}

                    <p className="mt-4 text-sm text-gray-300">
                        Typical duration: {service.duration}
                    </p>

                    {service.affects.length > 0 && (
                        <>
                            <h3 className="mt-6 text-sm font-semibold uppercase tracking-widest text-gray-400">
                                What moves the price
                            </h3>
                            <ul className="mt-2 flex flex-wrap gap-2">
                                {service.affects.map((item) => (
                                    <li
                                        key={item}
                                        className="rounded-full border border-gray-600 px-3 py-1 text-xs text-gray-300"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    {service.tool && (
                        <Link
                            to={service.tool.to}
                            className="mt-6 inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                        >
                            {service.tool.label}
                        </Link>
                    )}

                    <p className="mt-4 text-xs text-gray-400">
                        Indicative only, not an offer — see our{" "}
                        <Link to="/terms" className="underline hover:text-white">
                            Terms of Use
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </section>
    );
}

export default ServicesPage;
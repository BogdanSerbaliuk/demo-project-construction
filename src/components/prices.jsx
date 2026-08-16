import { Download, Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import manag1 from "../pictures/managers/manag1.jpg";
import manag2 from "../pictures/managers/manag2.jpg";
import manag3 from "../pictures/managers/manag3.jpg";
import manag4 from "../pictures/managers/manag4.jpg";
import manag5 from "../pictures/managers/manag5.jpg";
import manag6 from "../pictures/managers/manag6.jpg";
import manag7 from "../pictures/managers/manag7.jpg";

const MANAGER_CARDS = [
    { id: 1, name: "Olivia Bennett", position: "Project Manager", email: "olivia.bennett@example.com", phone: "+1 0001110001", image: manag1 },
    { id: 2, name: "Liam Anderson", position: "Site Supervisor", email: "liam.anderson@example.com", phone: "+1 0001110001", image: manag2 },
    { id: 3, name: "Noah Parker", position: "Civil Engineer", email: "noah.parker@example.com", phone: "+1 0001110001", image: manag4 },
    { id: 4, name: "Emma Mitchell", position: "Construction Estimator", email: "emma.mitchell@example.com", phone: "+1 0001110001", image: manag3 },
    { id: 5, name: "Sophia Carter", position: "Site Engineer", email: "sophia.carter@example.com", phone: "+1 0001110001", image: manag5 },
    { id: 6, name: "Ava Reynolds", position: "Safety Coordinator", email: "ava.reynolds@example.com", phone: "+1 0001110001", image: manag6 },
    { id: 7, name: "Ethan Brooks", position: "Construction Manager", email: "ethan.brooks@example.com", phone: "+1 0001110001", image: manag7 },
];

const VISIBLE_MANAGER_COUNT = 3;

function Prices() {
    const pdfPath = `${import.meta.env.BASE_URL}pdfs/electric.pdf`;

    const [expanded, setExpanded] = useState(false);
    const visibleItems = expanded ? MANAGER_CARDS : MANAGER_CARDS.slice(0, VISIBLE_MANAGER_COUNT);

    const [copied, setCopied] = useState(null);
    const copyTimeoutRef = useRef(null);


    useEffect(() => () => clearTimeout(copyTimeoutRef.current), []);

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            clearTimeout(copyTimeoutRef.current);
            setCopied(text);
            copyTimeoutRef.current = setTimeout(() => setCopied(null), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return (
        <section className="flex w-full flex-col items-center gap-10 bg-gray-900 px-4 py-16 text-white sm:px-6">

            <h2 className="text-sm font-semibold uppercase tracking-widest text-white/90">
                Meet Our Team
            </h2>

            <div className="flex w-full max-w-6xl flex-col items-center gap-8">

                <ul className="flex w-full flex-wrap justify-center gap-6">
                    {visibleItems.map((manager) => (
                        <li
                            key={manager.id}
                            className="@container w-full md:w-[calc((100%-1.5rem)/2)] xl:w-[calc((100%-3rem)/3)]"
                        >
                            <article className="flex h-full flex-col items-center gap-4 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-orange-950 p-5 text-center @sm:flex-row @sm:gap-5 @sm:text-left">
                                <img
                                    src={manager.image}
                                    alt={manager.name}
                                    loading="lazy"
                                    width={128}
                                    height={128}
                                    className="h-24 w-24 shrink-0 rounded-full object-cover @sm:h-28 @sm:w-28 @lg:h-32 @lg:w-32"
                                />
                                <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5 @sm:items-start">
                                    <h3 className="text-lg font-semibold @sm:text-xl">
                                        {manager.name}
                                    </h3>

                                    <p className="text-sm text-gray-300 @sm:text-base">
                                        {manager.position}
                                    </p>

                                    <button
                                        type="button"
                                        title="Click to copy email"
                                        onClick={() => copyToClipboard(manager.email)}
                                        className="max-w-full cursor-pointer break-all rounded text-sm hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                                    >
                                        {manager.email}
                                    </button>

                                    <button
                                        type="button"
                                        title="Click to copy phone number"
                                        onClick={() => copyToClipboard(manager.phone)}
                                        className="max-w-full cursor-pointer break-all rounded text-sm hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                                    >
                                        {manager.phone}
                                    </button>
                                </div>
                            </article>
                        </li>
                    ))}
                </ul>

                {MANAGER_CARDS.length > VISIBLE_MANAGER_COUNT && (
                    <button
                        type="button"
                        onClick={() => setExpanded((prev) => !prev)}
                        aria-expanded={expanded}
                        className="rounded-full px-6 py-3 text-white backdrop-blur-md transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:scale-90 active:bg-blue-600"
                    >
                        {expanded ? "Show Less" : `Show More (${MANAGER_CARDS.length - VISIBLE_MANAGER_COUNT})`}
                    </button>
                )}
            </div>

            <div className="flex w-full max-w-6xl flex-col items-center gap-4 text-center">
                <p className="max-w-prose text-balance">
                    There are also attached documents where you can independently familiarize
                    yourself with the cost of services.
                </p>

                <div className="flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row">
                    <a
                        href={pdfPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-md bg-blue-500 px-8 py-3 font-medium transition-colors hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                    >
                        <Eye size={20} aria-hidden="true" /> Check online
                    </a>
                    <a
                        href={pdfPath}
                        download
                        className="flex items-center justify-center gap-2 rounded-md bg-blue-500 px-8 py-3 font-medium transition-colors hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                    >
                        <Download size={20} aria-hidden="true" /> Download
                    </a>
                </div>
            </div>

            <div role="status" aria-live="polite" className="sr-only">
                {copied ? `${copied} copied to clipboard` : ""}
            </div>

            {copied && (
                <div
                    aria-hidden="true"
                    className="fixed top-5 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-blue-500 px-6 py-3 text-sm text-white shadow-lg"
                >
                    Copied
                </div>
            )}
        </section>
    );
}

export default Prices;
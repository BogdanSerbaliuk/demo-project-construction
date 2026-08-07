import { Download, Eye } from "lucide-react";
import {useState} from "react";
import manag1 from "../pictures/managers/manag1.jpg";
import manag2 from "../pictures/managers/manag2.jpg";
import manag3 from "../pictures/managers/manag3.jpg";
import manag4 from "../pictures/managers/manag4.jpg";
import manag5 from "../pictures/managers/manag5.jpg";
import manag6 from "../pictures/managers/manag6.jpg";
import manag7 from "../pictures/managers/manag7.jpg";

function Prices() {
    const managerCards = [
        {
            id: 1,
            name: "Olivia Bennett",
            position: "Project Manager",
            email: "olivia.bennett@example.com",
            phone: "+1 0001110001",
            image: manag1,
        },
        {
            id: 2,
            name: "Liam Anderson",
            position: "Site Supervisor",
            email: "liam.anderson@example.com",
            phone: "+1 0001110001",
            image: manag2,
        },
        {
            id: 3,
            name: "Noah Parker",
            position: "Civil Engineer",
            email: "noah.parker@example.com",
            phone: "+1 0001110001",
            image: manag4,
        },
        {
            id: 4,
            name: "Emma Mitchell",
            position: "Construction Estimator",
            email: "emma.mitchell@example.com",
            phone: "+1 0001110001",
            image: manag3,
        },
        {
            id: 5,
            name: "Sophia Carter",
            position: "Site Engineer",
            email: "sophia.carter@example.com",
            phone: "+1 0001110001",
            image: manag5,
        },
        {
            id: 6,
            name: "Ava Reynolds",
            position: "Safety Coordinator",
            email: "ava.reynolds@example.com",
            phone: "+1 0001110001",
            image: manag6,
        },
        {
            id: 7,
            name: "Ethan Brooks",
            position: "Construction Manager",
            email: "ethan.brooks@example.com",
            phone: "+1 0001110001",
            image: manag7,
        }
    ];
    const pdfPath = `${import.meta.env.BASE_URL}pdfs/electric.pdf`;
    const VISIBLE_MANAGER_COUNT = 3;
    const [expanded, setExpanded] = useState(false);
    const visibleItems = expanded ? managerCards : managerCards.slice(0, VISIBLE_MANAGER_COUNT);


    const [copied, setCopied] = useState(false);
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return(
        <section className={`w-full  flex flex-col items-center justify-between bg-gray-900 text-white ${expanded ? "min-h-screen h-auto" : "min-h-screen h-auto lg:h-screen"}`}>
            <div className="w-full lg:h-5/8 flex flex-col items-center justify-start gap-5 lg:p-10 md:p-8 ">
                <div className="w-4/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleItems.map((manager) => (
                        <div key={manager.id} className="relative w-full aspect-5/3 overflow-hidden flex flex-row items-center justify-center gap-5 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-orange-950 p-4">
                            <div className="w-28 shrink-0 sm:w-1/3 md:w-32 lg:w-36">
                                <img
                                    src={manager.image}
                                    alt="Manager"
                                    className="aspect-square w-full rounded-full object-cover"
                                />
                            </div>
                            <div className="w-full text-center sm:w-2/3 sm:text-left">
                                <h1 className="text-lg font-semibold sm:text-xl lg:text-2xl">
                                    {manager.name}
                                </h1>

                                <h2 className="text-sm text-gray-600 sm:text-base lg:text-lg">
                                    {manager.position}
                                </h2>

                                <button
                                    type="button"
                                    onClick={() => copyToClipboard(manager.email)}
                                    className="block cursor-pointer text-sm hover:underline"
                                >
                                    {manager.email}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => copyToClipboard(manager.phone)}
                                    className="block cursor-pointer text-sm hover:underline"
                                >
                                    {manager.phone}
                                </button>
                                {copied && (
                                    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-lg bg-black px-4 py-2 text-sm text-white shadow-lg">
                                        Copied!
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {managerCards.length > VISIBLE_MANAGER_COUNT && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-white rounded-full p-4 backdrop-blur-md hover:bg-white/10 active:scale-90 active:bg-blue-600"
                    >
                        {expanded ? "Show Less" : "Show More"}
                    </button>
                )}
            </div>


            <div className="w-full lg:h-3/8 flex flex-col items-center justify-center ">
                <p>There are also attached documents where you can independently familiarize yourself with the cost of services.</p>

                <div className="flex gap-4">
                    <a
                        href={pdfPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-row px-10 py-3 bg-blue-500 rounded-md font-medium hover:bg-blue-600 transition-colors"
                    ><Eye size={20}/> Check online

                    </a>
                    <a
                        href={pdfPath}
                        download
                        className="flex flex-row px-6 py-3 bg-blue-500 rounded-md font-medium hover:bg-blue-600 transition-colors"
                    >
                        <Download size={20}/> Download
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Prices;

import {useState} from "react";
import portfolioBg from "../pictures/portfolioBg.jpg";
import ProjectCard from "../components/ui/CardPortfolioPage.jsx";
import ProjectDialog from "../components/ui/DialogPortfolioPage.jsx";

const FILTERS = ["All", "Residential", "Commercial", "Industrial"];
const PROJECTS = [
    { id: 1, title: "Willow Creek House",  tags: ["Residential"],               status: "Completed",   plotArea: 1200, buildingArea: 240, duration: "7 months",  cost: 4320000 },
    { id: 2, title: "Stone Ridge Cottage", tags: ["Residential"],               status: "Completed",   plotArea: 800,  buildingArea: 165, duration: "5 months",  cost: 2970000 },
    { id: 3, title: "Lakeside Residence",  tags: ["Residential"],               status: "In progress", plotArea: 2000, buildingArea: 380, duration: "11 months", cost: 7220000 },
    { id: 4, title: "Birch Lane Duplex",   tags: ["Residential", "Commercial"], status: "Completed",   plotArea: 1500, buildingArea: 310, duration: "9 months",  cost: 5580000 },
    { id: 5, title: "Hillside Villa",      tags: ["Residential"],               status: "In progress", plotArea: 2400, buildingArea: 420, duration: "12 months", cost: 8400000 },
    { id: 6, title: "Orchard Park Office", tags: ["Commercial"],                status: "Completed",   plotArea: 950,  buildingArea: 190, duration: "6 months",  cost: 3420000 },
    { id: 7, title: "Maple Court Depot",   tags: ["Industrial", "Commercial"],  status: "Completed",   plotArea: 3100, buildingArea: 510, duration: "14 months", cost: 10200000 },
    { id: 8,  title: "Cedar Grove Townhouses",   tags: ["Residential"],              status: "In progress", plotArea: 2600,  buildingArea: 640,  duration: "15 months", cost: 11520000 },
    { id: 9,  title: "Riverbend Family Home",    tags: ["Residential"],              status: "Completed",   plotArea: 1050,  buildingArea: 210,  duration: "6 months",  cost: 3990000 },
    { id: 10, title: "Harbour View Apartments",  tags: ["Residential", "Commercial"], status: "In progress", plotArea: 3400,  buildingArea: 1450, duration: "22 months", cost: 29000000 },
    { id: 11, title: "Market Street Retail",     tags: ["Commercial"],               status: "Completed",   plotArea: 1600,  buildingArea: 880,  duration: "10 months", cost: 19360000 },
    { id: 12, title: "Northgate Business Centre",tags: ["Commercial"],               status: "In progress", plotArea: 3800,  buildingArea: 2200, duration: "20 months", cost: 52800000 },
    { id: 13, title: "Eastfield Logistics Hub",  tags: ["Industrial"],               status: "Completed",   plotArea: 9500,  buildingArea: 4200, duration: "13 months", cost: 54600000 },
    { id: 14, title: "Ironworks Assembly Plant", tags: ["Industrial"],               status: "In progress", plotArea: 14000, buildingArea: 6800, duration: "26 months", cost: 81600000 },
    { id: 15, title: "Southline Cold Storage",   tags: ["Industrial", "Commercial"], status: "Completed",   plotArea: 3600,  buildingArea: 1800, duration: "11 months", cost: 25200000 },
];


function PortfolioPage() {
    // filter listener
    const [filter, setFilter] = useState("All");
    const visible = filter === "All" ? PROJECTS : PROJECTS.filter((project) => project.tags.includes(filter));

    // track which card is open
    const [openProject, setOpenProject] = useState(null);


    return(
        <main className="w-full min-h-dvh">
            <section className="relative h-[60vh] w-full">
                <img
                    src={portfolioBg}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />

                <div className="relative flex h-full flex-col items-center justify-center px-4 pt-16 text-center">
                    <h1 className="mb-4 text-4xl font-bold md:text-5xl text-white">Our Portfolio</h1>
                    <p className="max-w-prose text-gray-200">
                        Here you can find info about our projects — what we have built and
                        what we are working on now.
                    </p>
                </div>
            </section>
            <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
                <div className="flex flex-wrap gap-3">
                    {FILTERS.map((option) => (
                        <button
                            key={option}
                            type="button"
                            aria-pressed={option === filter}
                            onClick={() => setFilter(option)}
                            className={`cursor-pointer border px-4 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 ${
                                option === filter
                                    ? "border-blue-600 bg-blue-600 text-white"
                                    : "border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white"
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </section>

            <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
                <p className="mt-4 text-sm text-gray-400">
                    {visible.length} {visible.length === 1 ? "project" : "projects"}
                </p>

                {visible.length === 0 ? (
                    <p className="mt-10 text-gray-400">No projects in this category yet.</p>
                ) : (
                    <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {visible.map((project) => (
                            <li key={project.id}>
                                <ProjectCard project={project} onOpen={() => setOpenProject(project)} />
                            </li>
                        ))}
                    </ul>
                )}
            </section>
            {openProject && (
                <ProjectDialog project={openProject} onClose={() => setOpenProject(null)} />
            )}

        </main>
    )
}
export default PortfolioPage;
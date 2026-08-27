
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import portfolioBg from "../pictures/portfoliobg.jpg";
import ProjectCard from "../components/ui/CardPortfolioPage.jsx";

const FILTERS = ["All", "Residential", "Commercial", "Industrial"];
const PROJECTS = [
    { id: 1, title: "Willow Creek House",  tags: ["Residential"],               status: "Completed",   plotArea: 1200, buildingArea: 240, duration: "7 months",  cost: 4320000 },
    { id: 2, title: "Stone Ridge Cottage", tags: ["Residential"],               status: "Completed",   plotArea: 800,  buildingArea: 165, duration: "5 months",  cost: 2970000 },
    { id: 3, title: "Lakeside Residence",  tags: ["Residential"],               status: "In progress", plotArea: 2000, buildingArea: 380, duration: "11 months", cost: 7220000 },
    { id: 4, title: "Birch Lane Duplex",   tags: ["Residential", "Commercial"], status: "Completed",   plotArea: 1500, buildingArea: 310, duration: "9 months",  cost: 5580000 },
    { id: 5, title: "Hillside Villa",      tags: ["Residential"],               status: "In progress", plotArea: 2400, buildingArea: 420, duration: "12 months", cost: 8400000 },
    { id: 6, title: "Orchard Park Office", tags: ["Commercial"],                status: "Completed",   plotArea: 950,  buildingArea: 190, duration: "6 months",  cost: 3420000 },
    { id: 7, title: "Maple Court Depot",   tags: ["Industrial", "Commercial"],  status: "Completed",   plotArea: 3100, buildingArea: 510, duration: "14 months", cost: 10200000 },
];


function PortfolioPage() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("All");

    const visible = filter === "All" ? PROJECTS : PROJECTS.filter((project) => project.tags.includes(filter));

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
                                <ProjectCard project={project} />
                            </li>
                        ))}
                    </ul>
                )}
            </section>

        </main>
    )
}
export default PortfolioPage;
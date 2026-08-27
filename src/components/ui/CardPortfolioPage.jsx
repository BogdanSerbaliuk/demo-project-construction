import aboutPhoto from "../../pictures/about.jpg";

function ProjectCard({ project }) {
    return (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl ring-1 ring-gray-700">
            <img
                src={aboutPhoto}
                alt={project.title}
                loading="lazy"
                className="aspect-video w-full object-cover"
            />

            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                            project.status === "Completed"
                                ? "bg-green-900 text-green-300"
                                : "bg-blue-900 text-blue-300"
                        }`}
                    >
                        {project.status}
                    </span>
                </div>

                <ul className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                        <li
                            key={tag}
                            className="rounded-full border border-black px-2.5 py-0.5 text-xs text-black"
                        >
                            {tag}
                        </li>
                    ))}
                </ul>

                <dl className="mt-4 flex flex-col gap-2 text-sm">
                    <Row label="Plot area" value={`${project.plotArea.toLocaleString()} m²`} />
                    <Row label="Building area" value={`${project.buildingArea} m²`} />
                    <Row label="Time spent" value={project.duration} />
                    <Row label="Cost" value={`${project.cost.toLocaleString()} ₴`} />
                </dl>
            </div>
        </article>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex justify-between gap-4 border-b border-gray-700 pb-2 last:border-0">
            <dt className="text-black">{label}</dt>
            <dd className="font-medium">{value}</dd>
        </div>
    );
}

 export default ProjectCard;
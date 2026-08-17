import officeTeam from "../pictures/officeteam.jpg";
import siteTeam from "../pictures/siteteam.jpg";

// Alternating image/text rows — the layout flips itself on odd rows, so adding
// a third block means adding an entry here and nothing else.
const TEAM_BLOCKS = [
    {
        id: "office",
        label: "In the office",
        title: "Planning that keeps a build on track",
        text: "Behind every project is an office team keeping the details straight — estimating, scheduling, and staying in touch with clients so nothing falls through the cracks between the blueprint and the build.",
        image: officeTeam,
        alt: "Our office team at work",
    },
    {
        id: "site",
        label: "On site",
        title: "Crews who get the details right first time",
        text: "On site, our crews turn those plans into concrete, framing, and finished rooms — experienced tradespeople who take pride in getting the details right the first time.",
        image: siteTeam,
        alt: "Our site team on a construction site",
    },
];

// Placeholder figures — swap these for real numbers before launch.
const STATS = [
    { id: "years", value: "15+", label: "Years building" },
    { id: "projects", value: "240", label: "Projects delivered" },
    { id: "crew", value: "30", label: "People on the team" },
];

function About() {
    return (
        <section className="flex min-h-screen w-full flex-col items-center justify-center gap-14 bg-gray-900 px-4 py-20 text-white sm:px-6">

            <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-white/90">
                    A little bit about our team
                </h2>
                <p className="text-balance text-gray-300">
                    Two halves of the same company — one drawing up the plan, the other
                    pouring it in concrete.
                </p>
            </div>

            <div className="flex w-full max-w-6xl flex-col gap-12 md:gap-16">
                {TEAM_BLOCKS.map((block, index) => (
                    <article
                        key={block.id}
                        className={`flex w-full flex-col items-center gap-6 md:gap-10 ${
                            index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                        }`}
                    >
                        <div className="group relative h-64 w-full overflow-hidden rounded-2xl ring-1 ring-white/10 md:h-80 md:w-1/2 lg:h-96">
                            <img
                                src={block.image}
                                alt={block.alt}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover object-top motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </div>

                        <div className="flex w-full flex-col gap-3 text-center md:w-1/2 md:text-left">
                            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                                {block.label}
                            </span>

                            <h3 className="text-balance text-2xl font-semibold">
                                {block.title}
                            </h3>

                            <p className="text-gray-300">
                                {block.text}
                            </p>
                        </div>
                    </article>
                ))}
            </div>

            <dl className="grid w-full max-w-3xl grid-cols-3 gap-4 border-t border-white/10 pt-8 text-center">
                {STATS.map((stat) => (
                    <div key={stat.id} className="flex flex-col gap-1">
                        {/* value first visually, label underneath — dt must precede dd in the markup */}
                        <dt className="order-2 text-xs text-gray-400 sm:text-sm">{stat.label}</dt>
                        <dd className="order-1 text-2xl font-semibold sm:text-3xl">{stat.value}</dd>
                    </div>
                ))}
            </dl>

        </section>
    )
}

export default About;

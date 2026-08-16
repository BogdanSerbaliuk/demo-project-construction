import officeTeam from "../pictures/officeteam.jpg";
import siteTeam from "../pictures/siteteam.jpg";

function About() {
    return (
        <section className="w-full min-h-screen flex flex-col items-center justify-center gap-10 bg-gray-900 text-white py-12 px-4">

            <h2 className="text-sm font-semibold uppercase tracking-widest text-white/90">
                A little bit about our team
            </h2>

            <div className="w-full max-w-6xl flex flex-col gap-10">

                <div className="w-full flex flex-col md:flex-row items-center gap-5">
                    <div className="w-full md:w-1/2 h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden">
                        <img
                            src={officeTeam}
                            alt="Our office team at work"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center md:text-left">
                        <p>
                            Behind every project is an office team keeping the details straight —
                            estimating, scheduling, and staying in touch with clients so nothing
                            falls through the cracks between the blueprint and the build.
                        </p>
                    </div>
                </div>

                <div className="w-full flex flex-col md:flex-row-reverse items-center gap-5">
                    <div className="w-full md:w-1/2 h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden">
                        <img
                            src={siteTeam}
                            alt="Our site team on a construction site"
                            className="w-full h-full object-cover object-top"
                        />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center md:text-left">
                        <p>
                            On site, our crews turn those plans into concrete, framing, and finished
                            rooms — experienced tradespeople who take pride in getting the details
                            right the first time.
                        </p>
                    </div>
                </div>

            </div>

        </section>
    )
}

export default About;
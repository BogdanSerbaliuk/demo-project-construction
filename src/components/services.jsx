const services = [
    "Construction of houses and cottages",
    "Individual planning",
    "Concrete works",
    "Modern renovation",
    "Warranty service",
]
const servicesDescription = [
    "We turn your blueprint into a solid, comfortable home built to last for generations",
    "Every project starts from scratch, shaped entirely around your lifestyle, land, and vision",
    "From foundations to driveways, we deliver precision pours that stand the test of time",
    "We breathe new life into old spaces, blending contemporary design with lasting craftsmanship",
    "Our commitment doesn't end at handover — we stand behind our work long after the final brick is laid",
]

function Services() {
    return (
        <section className="relative w-full h-screen">
            <img
                src="src/pictures/backyard.webp"
                alt="Backyard"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute inset-0 flex flex-col items-center">

                <div className="w-full h-4/5 flex flex-row items-center justify-around ">
                    <div className="text-center text-1xl text-white">
                        <ul className="">
                            {services.map((service) => (
                                <li
                                    key={service}
                                    className="flex items-center justify-center my-3 p-9 bg-black/70"
                                >{service}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="text-center text-1xl text-white">
                        <ul className="">
                            {servicesDescription.map((service) => (
                                <li
                                    key={service}
                                    className="flex items-center justify-center my-3 p-9 bg-black/70"
                                >{service}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="w-full h-1/5 inset-0 flex items-center justify-center">
                    <button className="px-9 py-5 bg-blue-500 rounded-md font-medium text-white cursor-pointer">Discover more</button>
                </div>

            </div>

        </section>


    )

}




export default Services;
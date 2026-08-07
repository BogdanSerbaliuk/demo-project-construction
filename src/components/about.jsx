import officeTeam from "../pictures/officeteam.jpg";
import siteTeam from "../pictures/siteteam.jpg";

function About() {
    return (
        <section className="w-full h-screen relative bg-gray-900 text-white">

            <div className="absolute inset-0 flex flex-col items-center justify-center">

                <div className="w-full h-1/8 flex flex-row items-center justify-center ">
                    <p className="">A little bit about our Team</p>
                </div>

                <div className="w-full h-7/8 flex flex-col items-center justify-around gap-5">

                    <div className="w-full h-full flex flex-row items-center justify-center  overflow-hidden gap-5 p-4">
                        <div className="w-1/2 h-full rounded-2xl overflow-hidden">
                            <img src={officeTeam} alt="office team" className="w-full h-full object-cover object-top"/>
                        </div>

                        <div className="w-1/2 h-full flex flex-col items-center justify-center">
                            <p>
                            We are a team of passionate and dedicated professionals who are dedicated to providing
                            the best possible service to our clients. Our team consists of experienced professionals
                            who are committed to delivering high-quality work and exceeding our clients' expectations.'
                            </p>
                        </div>

                    </div>

                    <div className="w-full h-full flex flex-row items-center justify-center  overflow-hidden gap-5 p-4">


                        <div className="w-1/2 h-full flex flex-col items-center justify-center">
                            <p>
                                We are a team of passionate and dedicated professionals who are dedicated to providing
                                the best possible service to our clients. Our team consists of experienced professionals
                                who are committed to delivering high-quality work and exceeding our clients' expectations.'
                            </p>
                        </div>
                        <div className="w-1/2 h-full rounded-2xl overflow-hidden">
                            <img src={siteTeam} alt="office team" className="w-full h-full object-cover object-top"/>
                        </div>
                    </div>


                </div>
            </div>

        </section>
    )
}




export default About;
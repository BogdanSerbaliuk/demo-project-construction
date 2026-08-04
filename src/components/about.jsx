

function About() {
    return (
        <section className="w-full h-screen relative">
            <img
                src="src/pictures/about.jpg"
                alt="About"
                className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="w-full h-1/5">
                    <h1>Заголовок</h1>
                </div>
                <div className="w-full h-4/5 flex flex-row items-center justify-around">
                    <div>info</div>
                    <div>2 pictures</div>

                </div>
            </div>

        </section>
    )
}




export default About;
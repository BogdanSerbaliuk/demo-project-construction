

function Home() {

    return(
        <section className="relative w-full h-[calc(100vh-4rem)]">
            {/* Background image fills the whole section */}
            <img
                src="src/pictures/homepagephoto.jpg"
                alt="Mansion front view"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark overlay — makes text readable over busy photos.
          Remove this div if your image is already dark/simple enough. */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Content sits on top because it comes after the image in the DOM,
          and it's positioned relative to the same parent via absolute + inset-0 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    EliteCraft Contractors
                </h1>
                <p className="text-lg mb-6 max-w-md">
                    We build with heart, we create with passion.
                </p>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-blue-500 rounded-md font-medium hover:bg-blue-600 transition-colors">
                        Get Started
                    </button>
                    <button className="px-6 py-3 border border-white rounded-md font-medium hover:bg-white/10 transition-colors">
                        Learn More
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Home;
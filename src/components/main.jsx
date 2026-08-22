import homepagePhoto from "../pictures/homepagephoto.jpg";
import Button from "../components/ui/button.jsx";

function Main() {

    return(
        <section className="relative w-full h-[calc(100vh-4rem)]">
            <img
                src={homepagePhoto}
                alt="Mansion front view"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />

            <div className="absolute inset-0 px-4">
                <div className="w-full h-full flex flex-col justify-center items-center text-center text-white
                md:items-start md:justify-end md:p-16 md:text-left md:pb-38 md:pl-38
                lg:items-start lg:justify-end lg:p-24 lg:text-left lg:pb-45 lg:pl-45
                "
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            EliteCraft Contractors
                        </h1>
                    </div>
                    <div>
                        <p className="text-lg mb-6 max-w-md">
                            We build with heart, we create with passion.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row">
                        <Button variant="ghost">Contact us</Button>
                        <Button variant="ghost" to="/tilecounter">Viev portfolio</Button>

                    </div>
                </div>
            </div>



        </section>
    )
}

export default Main;
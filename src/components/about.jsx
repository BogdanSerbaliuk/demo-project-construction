

function About() {
    return (
        <section className="w-full h-screen relative">

            <div className="absolute inset-0 flex flex-col items-center justify-center">

                <div className="w-full h-1/6 flex flex-row items-center justify-center border-2">
                    <p>A little bit about our Team</p>
                </div>

                <div className="w-full h-5/6 flex flex-row items-center justify-around">

                    <div className="w-1/3 h-full flex flex-col items-center justify-center border-2">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores blanditiis debitis delectus, deserunt ducimus libero molestiae neque nobis nostrum porro qui rem reprehenderit repudiandae saepe sapiente ullam ut, velit voluptatibus.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci amet commodi consequuntur cupiditate enim excepturi, facilis harum hic maiores nam, officia quaerat quibusdam rem reprehenderit saepe sint voluptas voluptate voluptatum!</p>
                    </div>
                    <div className="w-1/3 h-full flex flex-col items-center justify-center border-2">
                        <p>2 pictures</p>
                    </div>


                </div>
            </div>

        </section>
    )
}




export default About;
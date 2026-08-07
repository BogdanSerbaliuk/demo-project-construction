import { Download } from "lucide-react";

function Prices() {
    return(

        <section className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <div className="w-full h-1/8 flex flex-row items-center justify-center ">
                <h1>Prices policies</h1>
            </div>

            <div className="w-full h-4/8 flex flex-row items-center justify-around gap-5">
                <p>Contact office managers section</p>
            </div>

            <div className="w-full h-3/8 flex flex-col items-center justify-center ">
                <p>download prices section</p>

                <a
                    href="https://www.google.com"
                    className="flex items-center gap-2 px-6 py-3
                   bg-blue-500 text-white rounded-lg font-medium
                   hover:bg-blue-600 active:bg-blue-700
                   transition-all duration-200 shadow-md"
                >
                    <Download size={20} />
                    Download
                </a>
            </div>


        </section>
    )
}

export default Prices;
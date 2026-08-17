import Navbar from "../components/navbar.jsx";
import Main from "../components/main.jsx";
import Services from "../components/services.jsx";
import Prices from "../components/prices.jsx";
import About from "../components/about.jsx";
import Location from "../components/location.jsx";
import Footer from "../components/footer.jsx";


function Home() {
    return(
        <div>
            <div className="h-screen flex flex-col ">
                <Navbar/>
                <Main/>
            </div>
            <Services/>
            <Prices/>
            <About/>
            <Location/>
            <Footer/>
        </div>
    )
}

export default Home;
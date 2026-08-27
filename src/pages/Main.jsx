import Navbar from "../components/navbar.jsx";
import Header from "../components/header.jsx";
import Services from "../components/services.jsx";
import Prices from "../components/prices.jsx";
import About from "../components/about.jsx";
import Location from "../components/location.jsx";
import Footer from "../components/footer.jsx";


function Main() {
    return(
        <div>
            <Header/>
            <Services/>
            <Prices/>
            <About/>
            <Location/>
        </div>
    )
}

export default Main;
import './App.css'
import Navbar from "./components/navbar.jsx";
import Home from "./components/home.jsx";
import Services from "./components/services.jsx";
import About from "./components/about.jsx";
import Prices from "./components/prices.jsx";
import Location from "./components/location.jsx";
import Footer from "./components/footer.jsx";




function App() {
    return(
        <div>
            <div className="h-screen flex flex-col ">
                <Navbar/>
                <Home/>
            </div>
            <Services/>
            <Prices/>
            <About/>
            <Location/>
            <Footer/>
        </div>
    )
}







export default App

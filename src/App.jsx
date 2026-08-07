import './App.css'
import Navbar from "./components/navbar.jsx";
import Home from "./components/home.jsx";
import Services from "./components/services.jsx";
import About from "./components/about.jsx";




function App() {
    return(
        <div className="snap-y snap-mandatory">
            <div className="h-screen flex flex-col ">
                <Navbar/>
                <Home/>
            </div>
            <Services/>
            <About/>
        </div>
    )
}







export default App

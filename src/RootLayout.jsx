import Navbar from "./components/navbar.jsx";
import {Outlet} from "react-router-dom";
import Footer from "./components/footer.jsx";


function RootLayout() {
    return(
        <>
            <Navbar/>
            <Outlet/>
            <Footer/>
        </>
    )
}
export default RootLayout;
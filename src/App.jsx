import './App.css'
import {Routes, Route, useLocation} from "react-router-dom";
import Main from "./pages/Main.jsx";
import {useLayoutEffect} from "react";

import TermsOfUse from "./pages/TermsOfUse.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TileCounter from "./pages/TileCounter.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";
import RootLayout from "./RootLayout.jsx";


function ScrollToTop() {
    const { pathname } = useLocation();
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    },[pathname]);
    return null;
}

function App() {
    return(
        <>
            <ScrollToTop />
            <Routes>
                <Route element={<RootLayout/>}>
                    <Route path="/" element={<Main/>}/>
                    <Route path="/services" element={<ServicesPage/>}/>
                    <Route path="/portfolio" element={<PortfolioPage/>}/>
                    <Route path="/tilecounter" element={<TileCounter/>}/>
                    <Route path="/terms" element={<TermsOfUse/>}/>
                    <Route path="/privacy" element={<PrivacyPolicy/>}/>
                </Route>
                <Route path="*" element={<NotFound/>}/>
            </Routes>

        </>

    )
}







export default App

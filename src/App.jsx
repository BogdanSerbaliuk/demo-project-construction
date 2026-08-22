import './App.css'
import Home from "./pages/Home.jsx";
import {Routes, Route, useLocation} from "react-router-dom";
import TermsOfUse from "./pages/termsOfUse.jsx";
import PrivacyPolicy from "./pages/privacyPolicy.jsx";
import {useLayoutEffect} from "react";
import TileCounter from "./pages/TileCounter.jsx";

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
                <Route path="/" element={<Home/>}/>
                <Route path="/tilecounter" element={<TileCounter/>}/>
                <Route path="/terms" element={<TermsOfUse/>}/>
                <Route path="/privacy" element={<PrivacyPolicy/>}/>
            </Routes>
        </>

    )
}







export default App

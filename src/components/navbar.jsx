import {useEffect, useState} from "react";
import { Menu, X } from "lucide-react";
import {Links, Link} from "react-router-dom";

const navLinks = [
    { label: "Main", to: "/" },
    { label: "Services", to: "/services" },
    { label: "Portfolio", to: "/portfolio" },
    { label: "Price", to: "*" },
    { label: "About", to: "*" },
    { label: "Contacts", to: "*" },
];

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeLink, setActiveLink] = useState("/");

    // background color shifting
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll(); // run once, so a refresh mid-page starts in the right state
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav className={`fixed inset-x-0 top-0 z-50 text-white transition-colors duration-300 ${
            scrolled ? "bg-gray-900/95 shadow-lg backdrop-blur" : "bg-transparent"
        }`}
        >
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo / brand */}
                    <span className="font-bold text-lg">My App</span>

                    {/* Desktop links — hidden on small screens */}
                    <div className="hidden md:flex gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setActiveLink(link.to)}
                                className={`text-sm transition-colors`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile menu button — hidden on desktop */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-md hover:bg-gray-800"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Mobile dropdown — only rendered when open */}
                {isMenuOpen && (
                    <div className="md:hidden flex flex-col gap-2 pb-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => {
                                    setActiveLink(link.to);
                                    setIsMenuOpen(false); // close menu after picking a link
                                }}
                                className={`text-sm px-2 py-2 rounded-md ${
                                    activeLink === link.to
                                        ? "bg-gray-800 text-blue-400"
                                        : "text-gray-300 hover:bg-gray-800"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
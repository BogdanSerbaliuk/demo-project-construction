import { useState } from "react";
import { Menu, X } from "lucide-react";

// Keep nav data as an array — makes it easy to add/remove links
// without touching the JSX structure itself.
const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
];

function Navbar() {
    // Controls the mobile dropdown menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Tracks which link is "active" — in a real app this would
    // come from a router (e.g. useLocation() in react-router),
    // but plain state works fine for learning the pattern.
    const [activeLink, setActiveLink] = useState("/");

    return (
        <nav className="bg-gray-900 text-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo / brand */}
                    <span className="font-bold text-lg">My App</span>

                    {/* Desktop links — hidden on small screens */}
                    <div className="hidden md:flex gap-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setActiveLink(link.href)}
                                className={`text-sm transition-colors ${
                                    activeLink === link.href
                                        ? "text-blue-400 font-medium"
                                        : "text-gray-300 hover:text-white"
                                }`}
                            >
                                {link.label}
                            </a>
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
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => {
                                    setActiveLink(link.href);
                                    setIsMenuOpen(false); // close menu after picking a link
                                }}
                                className={`text-sm px-2 py-2 rounded-md ${
                                    activeLink === link.href
                                        ? "bg-gray-800 text-blue-400"
                                        : "text-gray-300 hover:bg-gray-800"
                                }`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
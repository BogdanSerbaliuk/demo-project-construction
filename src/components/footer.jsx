import { MapPin,Mail,Phone } from "lucide-react";
import {useState} from "react";

function Footer() {
    const [copied, setCopied] = useState(false);
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    }
    return(
        <section className="w-full h-screen  bg-gray-800 text-white">

            <div className="w-full h-4/5 flex flex-row items-center justify-around p-4">

                <div className="w-2/5 h-4/5 flex flex-col items-start justify-center gap-6">
                    <div className="flex flex-col gap-4 overflow-hidden">
                        <p>
                            We welcome in-person visits for clients who'd like to discuss
                            their project in detail. Our team is available to review
                            blueprints, materials, and timelines directly at our office —
                            we recommend scheduling ahead to ensure a team member is
                            available to assist you.
                        </p>

                        <div>
                            <h4 className="font-semibold mb-1">Office Hours</h4>
                            <p className="text-gray-300 text-sm">
                                Monday–Friday, 9:00 AM – 6:00 PM
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-1">Getting Here</h4>
                            <p className="text-gray-300 text-sm">
                                Located just off the main road with street parking available
                                nearby. Use the map for turn-by-turn directions, or reach out
                                beforehand if you'd like guidance on the best route.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => copyToClipboard("https://www.google.com/maps/search/?api=1&query=51.497895,-0.123396")}
                        className="flex items-center gap-3 cursor-pointer hover:text-orange-400 transition-colors duration-200"
                    >
                        <MapPin size={20} />
                        <span>123 Example Street, London, UK</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => copyToClipboard("mailto:contact@yourcompany.com")}
                        className="flex items-center gap-3 cursor-pointer hover:text-orange-400 transition-colors duration-200"
                    >
                        <Mail size={20} />
                        <span>contact@yourcompany.com</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => copyToClipboard("+1 0001110001")}
                        className="flex items-center cursor-pointer gap-3 hover:text-orange-400 transition-colors duration-200"
                    >
                        <Phone size={20} />
                        <span>+1 0001110001</span>
                    </button>

                    {copied && (
                        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-lg bg-black px-4 py-2 text-sm text-white shadow-lg">
                            Copied!
                        </div>
                    )}
                </div>

                <div className="w-2/5 h-full rounded-2xl overflow-hidden">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2946.136708687072!2d-0.1246254!3d51.5007292!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604c38c8cd1d9%3A0xb78f2474b9a45aa9!2sBig%20Ben!5e1!3m2!1sen!2spl!4v1786352050094!5m2!1sen!2spl"
                        className="w-full h-full"
                        style={{border: 0}}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="strict-origin-when-cross-origin"
                        title="map"
                    />

                </div>

            </div>

            <footer className="w-full h-1/5 border-t border-gray-600 bg-gray-900 text-white py-8 px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} Your Company. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <a href="#" className="hover:text-white transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </footer>


        </section>
    )
}

export default Footer;
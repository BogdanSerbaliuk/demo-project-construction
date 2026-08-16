

function Footer() {
    return(
        <footer className="w-full border-t border-gray-600 bg-gray-900 text-white py-8 px-4">
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
    )
}

export default Footer;
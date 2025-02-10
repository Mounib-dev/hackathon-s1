function Navbar() {
    return (
        <nav className="bg-gradient-to-r bg-pink-500 text-white shadow-lg py-4 px-6 flex justify-between items-center">
            <div className="text-2xl font-bold tracking-wide">
                EchoLink
            </div>
            <ul className="flex space-x-6">
                <li>
                    <a href="#accueil" className="hover:text-pink-900 transition duration-300">Accueil</a>
                </li>
                <li>
                    <a href="#services" className="hover:text-pink-900 transition duration-300">Services</a>
                </li>
                <li>
                    <a href="#contact" className="hover:text-pink-900 transition duration-300">Se Connecter</a>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;

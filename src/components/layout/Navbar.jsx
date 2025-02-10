function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-pink-500 bg-gradient-to-r px-6 py-4 text-white shadow-lg">
      <div className="text-2xl font-bold tracking-wide">EchoLink</div>
      <ul className="flex space-x-6">
        <li>
          <a href="/" className="transition duration-300 hover:text-pink-900">
            Demande
          </a>
        </li>
        <li>
          <a
            href="/login"
            className="transition duration-300 hover:text-pink-900"
          >
            Connexion
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

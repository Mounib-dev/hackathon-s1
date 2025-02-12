import { useState, useContext } from "react";
import { NotificationContext } from "../../context/NotitificationContext";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { notifications, unreadCount, markAllAsRead } =
    useContext(NotificationContext);
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      markAllAsRead();
    }
  };

  return (
    <nav className="flex items-center justify-between bg-pink-500 bg-gradient-to-r px-6 py-4 text-white shadow-lg">
      <div className="text-2xl font-bold tracking-wide">EchoLink</div>
      <ul className="flex space-x-6">
        {isLoggedIn ? (
          <>
            <li>
              <a
                href="/"
                className="transition duration-300 hover:text-pink-900"
              >
                Demande
              </a>
            </li>
            <li className="relative">
              <button
                onClick={toggleDropdown}
                className="relative focus:outline-none"
                aria-label="Notifications"
              >
                {/* Bell Icon */}
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C8.67 6.165 8 7.388 8 8.75V14.158c0 .538-.214 1.055-.595 1.437L6 17h5m4 0v1a3 3 0 11-6 0v-1m6 0H9"
                  ></path>
                </svg>
                {/* Notification Badge */}
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs leading-none font-bold text-red-100">
                    {unreadCount}
                  </span>
                )}
              </button>
              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 z-20 mt-2 w-48 rounded-md bg-white py-1 shadow-lg">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-2 text-gray-700">
                      Aucune nouvelle notification
                    </div>
                  ) : (
                    notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 px-4 py-2 text-gray-700"
                      >
                        {notification}
                      </div>
                    ))
                  )}
                </div>
              )}
            </li>
            <li>
              <a
                href=""
                onClick={logout}
                className="transition duration-300 hover:text-pink-900"
              >
                Déconnexion
              </a>
            </li>
          </>
        ) : (
          <li>
            <>
              <a
                href="/login"
                className="transition duration-300 hover:text-pink-900"
              >
                Connexion
              </a>
            </>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;

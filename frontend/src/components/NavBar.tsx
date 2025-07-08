import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <nav className="bg-gray-900 text-white shadow-lg" data-testid="navbar">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold hover:text-gray-300 transition-colors"
            data-testid="navbar-logo"
          >
            👥 User Management
          </Link>

          {/* Hamburger (mobile only) */}
          <button
            className="sm:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="navbar-hamburger"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Links */}
          <div
            className={`flex-col sm:flex-row sm:flex space-y-4 sm:space-y-0 sm:space-x-6 absolute sm:static bg-gray-900 left-0 right-0 top-16 sm:top-auto px-6 sm:px-0 py-4 sm:py-0 transition-all duration-300 ease-in-out ${
              isMenuOpen ? 'flex' : 'hidden'
            }`}
            data-testid="navbar-links"
          >
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-all ${
                location.pathname === '/'
                  ? 'bg-white text-gray-900 font-semibold'
                  : 'hover:bg-gray-800 hover:text-white'
              }`}
              data-testid="users-list-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Users List
            </Link>
            <Link
              to="/create"
              className={`px-4 py-2 rounded-lg transition-all ${
                location.pathname === '/create'
                  ? 'bg-white text-gray-900 font-semibold'
                  : 'hover:bg-gray-800 hover:text-white'
              }`}
              data-testid="create-user-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Create User
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiSearch, 
  FiHeart, 
  FiFolder, 
  FiBarChart2, 
  FiUser, 
  FiLogOut, 
  FiSun, 
  FiMoon,
  FiMenu,
  FiX
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
              <FiSearch className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hidden sm:block">
              ImageSearch Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={<FiSearch />} text="Search" />
            <NavLink to="/favorites" icon={<FiHeart />} text="Favorites" />
            <NavLink to="/collections" icon={<FiFolder />} text="Collections" />
            <NavLink to="/dashboard" icon={<FiBarChart2 />} text="Dashboard" />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="btn-icon"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FiSun className="text-yellow-500 text-xl" />
              ) : (
                <FiMoon className="text-gray-600 text-xl" />
              )}
            </button>

            {/* User Dropdown (Desktop) */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <img
                  src={user.avatar || 'https://via.placeholder.com/40'}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full border-2 border-purple-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.displayName}
                </span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FiUser className="text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 text-red-600 dark:text-red-400"
                  >
                    <FiLogOut />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden btn-icon"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-4 space-y-2">
            <MobileNavLink to="/" icon={<FiSearch />} text="Search" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink to="/favorites" icon={<FiHeart />} text="Favorites" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink to="/collections" icon={<FiFolder />} text="Collections" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink to="/dashboard" icon={<FiBarChart2 />} text="Dashboard" onClick={() => setMobileMenuOpen(false)} />
            <MobileNavLink to="/profile" icon={<FiUser />} text="Profile" onClick={() => setMobileMenuOpen(false)} />
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors duration-200"
            >
              <FiLogOut />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// Desktop Nav Link Component
const NavLink = ({ to, icon, text }) => {
  return (
    <Link
      to={to}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200 font-medium"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{text}</span>
    </Link>
  );
};

// Mobile Nav Link Component
const MobileNavLink = ({ to, icon, text, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-200 font-medium"
    >
      <span className="text-xl">{icon}</span>
      <span>{text}</span>
    </Link>
  );
};

export default Navbar;
